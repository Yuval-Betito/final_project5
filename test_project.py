#!/usr/bin/env python
"""
This module runs a series of tests on the Cost Manager API.
It sends HTTP requests to various endpoints and saves the results
to a specified output file.

The tested endpoints include:
  1. GET /api/about – retrieves team member information.
  2. GET /api/report – retrieves a monthly report for a given user.
  3. POST /api/add – adds a new cost item.
  4. GET /api/report – retrieves an updated monthly report after adding a cost item.

Usage:
    Run the script and provide a filename when prompted.
    Example:
        $ python test_project.py
        Enter output filename (e.g., output.txt): output.txt
"""

import sys
import requests

# Set the base URL of the API. Adjust this if your server is hosted remotely.
line = "http://localhost:3000"

# Request the name of the output file where test results will be saved.
output_filename = input("Enter output filename (e.g., output.txt): ")

# Open the output file in write mode with UTF-8 encoding and redirect stdout to this file.
output = open(output_filename, "w", encoding="utf-8")
sys.stdout = output

print("__________________________________")
print()
print("testing getting the about")
print("-------------------------")
try:
    # Construct the URL for the /api/about endpoint.
    url = line + "/api/about"
    # Send a GET request to the endpoint.
    data = requests.get(url)
    # Print the URL, status code, raw content, text content, and JSON-parsed response.
    print("כתובת: " + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("תקלה בנתיב /api/about: " + str(e))
print()

print("testing getting the report - 1")
print("------------------------------")
try:
    # Construct the URL for the initial /api/report endpoint.
    # This assumes that no cost items have been added yet (or the expected state is known).
    url = line + "/api/report?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("כתובת: " + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("תקלה בנתיב /api/report: " + str(e))
print()

print("testing adding cost item")
print("----------------------------------")
try:
    # Construct the URL for the /api/add endpoint.
    url = line + "/api/add"
    # Define the new cost item data.
    # In this example, we're adding a cost item "coffee 5" in the "food" category.
    data = requests.post(url, json={'userid': "123123", 'description': 'milk 9', 'category': 'food', 'sum': 8})
    print("כתובת: " + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
except Exception as e:
    print("תקלה בנתיב /api/add: " + str(e))
print()

print("testing getting the report - 2")
print("------------------------------")
try:
    # Construct the URL again for /api/report to retrieve an updated report
    # after the new cost item has been added.
    url = line + "/api/report?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("כתובת: " + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("תקלה בנתיב /api/report: " + str(e))
print()

print("\n========== סיום הבדיקה ==========\n")
