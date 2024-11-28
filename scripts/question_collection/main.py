
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import sys
import pickle
import bs4 as soup
from bs4 import Tag, NavigableString

from kaggle.api.kaggle_api_extended import KaggleApi
from zipfile import ZipFile
import os

import re
import json
import pandas as pd
from pandas import DataFrame, Series

#This script uses Kaggle data to create top-ten-like questions. It retrieves
#datasets, and finds suitable "metrics" on which to sort items - constructing
#top lists. The rankings are meant to be manually filtered and converted into
#questions by the end user.

FILES_PATH = "./files/"


def inner_child(child: Tag) -> Tag:
  for next_item in child.children:
    if type(next_item) == Tag:
      return next_item

def collect_helper(driver: WebDriver, links: list, start: int, pages: int,
                  attempts: int) -> list:
  '''
    Collects database links from Kaggle, and places them into a list.
  '''
  driver.get("https://www.kaggle.com/search?q=top+in%3Adatasets")
  #Remove the annoying bottom bar
  cookie_bar = driver.find_element(By.XPATH, '//div[text()="OK, Got it."]')
  cookie_bar.click()
  #Wait to load
  sleep(3)

  def next():
    next_page = driver.find_element(By.CSS_SELECTOR, "[aria-label='Go to next page']")
    ActionChains(driver).scroll_to_element(next_page)
    next_page.click()
    sleep(1)

  #Go to start (could be faster)
  for page in range(1, start):
    attempt = 1
    while True:
      try:
        next()
        break
      except:
        if (attempt <= attempts):
          print(f"Failed getting page {page + 1}. Trying again.")
          attempt += 1
          continue
        else:
          print(f"ERROR: Failed getting page {page + 1}.")
          return
  
  for i in range(0, pages):
    print(f"Page {start + i}")
    page = soup.BeautifulSoup(driver.page_source, "html.parser")
    body: Tag = page.find("body")

    results: Tag = body.css.select_one("#results")
    results = results.find("ul", recursive=False)
    for child in results.children:
      #Skip all empty strings
      if (type(child) == NavigableString): continue

      link = inner_child(inner_child(child))
      link_full = "https://kaggle.com/" + link.get("href")
      links.append(link_full)
    
    attempt = 1
    while True:
      try:
        next()
        break
      except:
        if (attempt < attempts):
          print(f"Failed getting page {start + i + 1}. Trying again.")
          attempt += 1
          continue
        else:
          print(f"Finished scraping on page {start + i + 1}.")
          return

#Collect and store kaggle links with the search term "top"
def collect(links: list, start: int = 1, pages: int = sys.maxsize,
           attempts: int = 3):
  links = []
  old_links: list
  try:
    with open("files/links.pickle", "rb") as file:
      old_links = pickle.load(file)
    links.extend(old_links)
  except Exception:
    pass

  driver = webdriver.Chrome()
  #So we don't lose progress
  try:
    collect_helper(driver, links, start, pages, attempts)
  except Exception as e:
    print(e)
  driver.close()

  with open("files/links.pickle", "wb") as file:
    pickle.dump(links, file)


#Download kaggle datasets from links
def download(links: list, start: int = 0, end: int = sys.maxsize,
            abort_on_error: bool = False, retries: int = 3):
  datasets_path = FILES_PATH + "datasets/"

  api = KaggleApi()

  for i in range(start, end):
    name: str = links[i].split("datasets/", 1)[1]
    print(f"Downloading for {name} (i = {i})")
    #Must be normalized to properly save
    folder_name: str = name.replace("/", "_", 1)
    
    try:
      os.mkdir(datasets_path + folder_name)
    except Exception as e:
      print(f"Error: Failed to create folder \"{folder_name}\"")
      print(e)
      continue
    
    attempt = 1
    while True:
      try:
        sleep(1)
        api.dataset_download_files(name, datasets_path + folder_name)
        api.dataset_metadata(name, datasets_path + folder_name)
        break
      except Exception as e:
        if (attempt < retries):
          print(f"Failed getting data. Trying again. {attempt}/{retries}")
          print(e)
          attempt += 1
          continue
        else:
          print("Failed getting data.")
          if (abort_on_error): return
          else: break
    
    print(f"Complete.")


#Check if a link follows a specific regex pattern
def filter_link(link: str) -> bool:
  pattern = r"(?i)^[^/]*/.*?(?<=-|/)(?:top|ranked|best)(?=-|$).*$"
  matched = re.match(pattern, link)
  return (matched != None)

def mine_helper(csv, sub_dataset: str) -> list:
  '''
    Uses pandas to extract usable Top 10 data from a kaggle dataset. The data
    is expected to be formatted as a csv - in one file.
  '''
  has_non_english = re.compile(r"(?i)^[\s\S]*?[^a-z0-9_!@#$%^&*().?<>~ -][\s\S]*$")

  dataset: DataFrame = pd.read_csv(csv) #May raise an exception
  if (len(dataset) < 10): return []
  data = []

  ###Step 1: Filter out columns we don't need

  #Step 1.1: Normalize and filter column names
  all_columns = list(dataset.columns)
  all_columns_temp = []

  for col in all_columns:
    new_col = re.sub(r"(?:^ *)|(?: *$)", "", col) #Trim
    new_col = re.sub(r"[_ ]+", " ", new_col) #De-widen spaces and remove underscores
    new_col = new_col.title() #Standardize case

    if (has_non_english.match(new_col)):
      continue
    all_columns_temp.append((col, new_col))

  all_columns = all_columns_temp

  #Step 1.2: Filter columns that cannot be values or metrics
  values = all_columns
  metrics = all_columns

  def filter_values(c) -> bool:
    col, new_col = c
    column: Series = dataset[col]
    #Type checking
    if (not pd.api.types.is_object_dtype(column)): return False
    #Unique checking
    uniques = column.drop_duplicates()
    ratio = len(uniques) / len(column)
    if (len(uniques) < 10 or ratio < 0.90): return False
    #Column name checking
    pattern = r"(?i)^.*?\b(?:date|day|month|year|id)\b.*$"
    if (re.match(pattern, new_col)): return False
    return True
  
  def filter_metrics(c) -> bool:
    col, new_col = c
    column = dataset[col]
    #Type checking
    if (not pd.api.types.is_numeric_dtype(column.dtype)): return False
    #Column name checking
    pattern = r"(?i)^.*?\b(?:date|day|month|year|id)\b.*$"
    if (re.match(pattern, new_col)): return False
    return True
  
  values = filter(filter_values, values)
  metrics = filter(filter_metrics, metrics)

  # print(list(values))
  # print(list(metrics))

  #Step 2: Collect data
  for (val, val_name) in values:
    for (met, met_name) in metrics:
      new_dataset = dataset[[val, met]] #SELECT the columns
      asc = new_dataset.sort_values(met, axis=0, ascending=True).drop_duplicates(val).head(10)
      desc = new_dataset.sort_values(met, axis=0, ascending=False).drop_duplicates(val).head(10)

      def destructure(table: DataFrame) -> list:
        table_list = []
        for row in table.itertuples(index=False, name=None):
          table_list.append(row)
        return table_list
      
      asc = destructure(asc)
      desc = destructure(desc)

      obj = {
        "name": f"{val_name} by {met_name}",
        "value": val,
        "metric": met,
        "sub_dataset": sub_dataset,
        "rankings_asc": asc,
        "rankings_desc": desc
      }

      data.append(obj)
  
  print(f"# Discovered {len(data)} total rankings.")
  return data

#Convert downloaded data into rankings
#rankings dict format:
'''
{
  person/dataset_name: {
    data: [
      {
        name: value column by metric column,
        value: value,
        metric: metric,
        sub_dataset: sub_dataset_name,
        rankings_asc: [
          (value1, metric1),
          (value2, metric2),
          ...
        ],
        rankings_desc: [
          (value1, metric1),
          (value2, metric2),
          ...
        ]
      },
      ...
    ],
    tags: [
      tag1,
      tag2,
      ...
    ]
  },
  ...
}
'''
def mine(links: list, rankings: dict, repeats: bool = False,
         abort_on_error: bool = False):
  datasets_path = FILES_PATH + "datasets/"

  #links = links[:200]

  for link in links:
    link: str = link.split("datasets/", 1)[1] #Normalize
    if (not filter_link(link)): continue #We don't need every piece of data
    if (link in rankings and not repeats):
      print(f"Skipping link \"{link}\"")
      continue

    print(f"@ Mining for link \"{link}\"")
    link_path = link.replace("/", "_", 1) #The folder for the link data
    name = link.split("/", 1)[1] #The name of the link's zip data

    name_path = datasets_path + link_path + "/" + name + ".zip"
    info_path = datasets_path + link_path + "/dataset-metadata.json"
    
    link_data = {"data": [], "tags": []}
    zipped_file = None
    info_file = None
    #Wrap both opens here to not do unnecessary computation
    try:
      zipped_file = ZipFile(name_path, "r")
      info_file = open(info_path, "rb")
    except Exception as e:
      print(f"Error: Failed to open files for \"{link}\"")
      print(e)
      if (zipped_file != None): zipped_file.close()
      if (abort_on_error): return
      else: continue

    def clean():
      zipped_file.close()
      info_file.close()

    #Tags portion
    info_json = {}
    try:
      info_json = json.load(info_file)
    except Exception as e:
      print(f"Error: Failed to convert \"{info_path}\" to JSON")
      print(e)
      if (abort_on_error):
        clean()
        return
      else: pass #Do not collect any tags; keep mining

    if ("keywords" in info_json):
      link_data["tags"] = info_json["keywords"]

    #Mining portion
    for archive_file in zipped_file.filelist:
      #NOTE: Certain zip files have a different structure, but we ignore that
      if (archive_file.is_dir()): continue
      split_name = archive_file.filename.rsplit(".", 1)
      if (len(split_name) == 1 or split_name[1] != "csv"): continue
      if (archive_file.file_size >= 1073741824):
        print(f"# File \"{archive_file.filename}\" is bigger than 1 GB; skipping.")
        continue

      file = None
      try:
        file = zipped_file.open(archive_file, "r", force_zip64=True)
      except Exception as e:
        print(f"Error: Failed to open file \"{archive_file.filename}\" from archive")
        print(e)
        if (abort_on_error):
          clean()
          return
        else: continue
      
      print(f"# Discovered file \"{archive_file.filename}\" in archive.")

      try:
        data_list = mine_helper(file, archive_file.filename)
        link_data["data"].extend(data_list)
      except Exception as e:
        print("Error: Problem during mining.")
        print(e)
        file.close()
        if (abort_on_error):
          clean()
          return
        else: continue

      file.close()
    
    #Cleanup
    clean()

    rankings[link] = link_data
    #print(json.dumps(rankings[link], indent=2))


#"Scratchboard." Currently set to filter and generate questions.
def main():
  rankings: dict
  with open("files/rankings.json", "r") as file:
    rankings = json.load(file)

  questions = []
  all_tags = {}
  
  total_data = 0
  for ranking in rankings:
    filtered = rankings[ranking]["data"]

    for tag in rankings[ranking]["tags"]:
      if tag not in all_tags: all_tags[tag] = 1
      else: all_tags[tag] += 1

    #Regex 1 (bad terms)
    se = re.compile(r"(?i)\b(?:userid|ids|tstamp|timestamp|index|key|description)\b")
    filtered = list(filter(lambda data: se.search(data["name"]) == None, filtered))

    #Manual filtering
    filtered = list(filter(lambda data: "FILTER" not in data or not data["FILTER"], filtered))

    #Construct chosen questions
    for item in filtered:
      if "NEW_NAME" in item:
        question = {
          "question": item["NEW_NAME"],
          "answerList": list(map(lambda x: x[0], (item["rankings_asc"] if item["CHOOSE_ASC"] else item["rankings_desc"]))),
          "category": item["CATEGORY"]
        }
        questions.append(question)

    rankings[ranking]["data"] = filtered
    total_data += len(filtered)
  
  #Erase any empty categories
  rankings = {key: val for (key, val) in rankings.items() if len(val["data"]) > 0}

  #Manual filtering
  rankings = {key: val for (key, val) in rankings.items() if "FILTER" not in val or
                                                           not val["FILTER"]}
  
  with open("files/rankings.json", "w", encoding="utf-8") as file:
    json.dump(rankings, file, indent=2)

  with open("files/questions.json", "w", encoding="utf-8") as file:
    json.dump(questions, file, indent=2)
  
  total = len(rankings)
  total_questions = len(questions)
  print(f"Total info: {total_data}")
  print(f"Total sources: {total}")
  print(f"Total questions: {total_questions}")
  # tags_list = list(all_tags.items())
  # tags_list.sort(key=lambda x: x[1], reverse=True)
  # print(tags_list)

if __name__ == "__main__": main()