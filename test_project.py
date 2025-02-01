import sys
import requests

# שימי לב: עדכני את כתובת השרת אם היא שונה (למשל, אם את מריצה בשרת מרוחק)
line = "http://localhost:3000"

filename = input("Enter output filename (e.g., output.txt): ")

# פתיחת קובץ הפלט לכתיבה, כל הפלט יודפס לקובץ זה
output = open(filename, "w", encoding="utf-8")
sys.stdout = output

print("__________________________________")
print()
print("testing getting the about")
print("-------------------------")
try:
    url = line + "/api/about"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("problem")
    print(e)
print()

print("testing getting the report - 1")
print("------------------------------")
try:
    url = line + "/api/report?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("problem")
    print(e)
print()

print("testing adding cost item")
print("----------------------------------")
try:
    url = line + "/api/add"
    data = requests.post(url, json={'userid': "123123", 'description': 'milk 9', 'category': 'food', 'sum': 8})
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
except Exception as e:
    print("problem")
    print(e)
print()

print("testing getting the report - 2")
print("------------------------------")
try:
    url = line + "/api/report?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    print("data.json()=" + str(data.json()))
except Exception as e:
    print("problem")
    print(e)
print()
