#!/usr/bin/env python
"""
This script runs a series of tests on the Cost Manager API using HTTP requests.
It sends requests to various endpoints and writes the output to a specified file.

Tested endpoints:
  1. GET /api/about  - Retrieves team member information.
  2. GET /api/users/123123 - Retrieves the details of a user with id "123123".
  3. POST /api/add  - Adds a new cost item (in this example, "coffee 5" in the "food" category).
  4. GET /api/report - Retrieves a monthly report for the user "123123" for the specified year and month.

Usage:
  Run the script and provide an output filename when prompted.
  Example:
      $ python test_project.py
      Enter output filename (e.g., output.txt): output.txt
"""

import sys
import requests

def main():
    """
    Main function to run the API tests.
    It sends HTTP requests to various endpoints of the Cost Manager API,
    and writes the results (including URLs, status codes, and responses) to an output file.
    """
    # Define the base URL of the API. Adjust if your server is hosted remotely.
    base_url = "http://localhost:3000"

    # Prompt the user to enter the name of the output file where test results will be saved.
    output_filename = input("Enter output filename (e.g., output.txt): ")

    # Open the output file in write mode with UTF-8 encoding and redirect stdout to this file.
    with open(output_filename, "w", encoding="utf-8") as output:
        sys.stdout = output

        print("========== בדיקת פרויקט Cost Manager ==========\n")

        # 1. Test the /api/about endpoint
        print("בדיקה של /api/about:")
        try:
            about_url = base_url + "/api/about"
            response = requests.get(about_url)
            print("כתובת: " + about_url)
            print("קוד סטטוס: " + str(response.status_code))
            print("תוכן (טקסט): " + response.text)
            print("תוכן (JSON): " + str(response.json()))
        except Exception as e:
            print("תקלה בנתיב /api/about: " + str(e))
        print("\n------------------------------------------\n")

        # 2. Test the GET /api/users/123123 endpoint (retrieve user details)
        print("בדיקה של /api/users/123123:")
        try:
            user_url = base_url + "/api/users/123123"
            response = requests.get(user_url)
            print("כתובת: " + user_url)
            print("קוד סטטוס: " + str(response.status_code))
            print("תוכן (טקסט): " + response.text)
            print("תוכן (JSON): " + str(response.json()))
        except Exception as e:
            print("תקלה בנתיב /api/users/123123: " + str(e))
        print("\n------------------------------------------\n")

        # 3. Test the POST /api/add endpoint (add a new cost item)
        print("בדיקה של /api/add:")
        try:
            add_url = base_url + "/api/add"
            # Define new cost data; in this example, adding "coffee 5" in the "food" category.
            cost_data = {
                "userid": "123123",
                "description": "coffee 5",
                "category": "food",
                "sum": 5
            }
            response = requests.post(add_url, json=cost_data)
            print("כתובת: " + add_url)
            print("קוד סטטוס: " + str(response.status_code))
            print("תוכן (טקסט): " + response.text)
            print("תוכן (JSON): " + str(response.json()))
        except Exception as e:
            print("תקלה בנתיב /api/add: " + str(e))
        print("\n------------------------------------------\n")

        # 4. Test the GET /api/report endpoint (retrieve updated monthly report)
        print("בדיקה של /api/report:")
        try:
            # In this test, we assume we are retrieving a report for user 123123 for year 2025 and month 2.
            report_url = base_url + "/api/report?id=123123&year=2025&month=2"
            response = requests.get(report_url)
            print("כתובת: " + report_url)
            print("קוד סטטוס: " + str(response.status_code))
            print("תוכן (טקסט): " + response.text)
            print("תוכן (JSON): " + str(response.json()))
        except Exception as e:
            print("תקלה בנתיב /api/report: " + str(e))
        print("\n========== סיום הבדיקה ==========\n")

if __name__ == "__main__":
    main()
