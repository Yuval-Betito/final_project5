import sys
import requests

def main():
    # הגדרת כתובת השרת – ודאי שהשרת שלך מאזין על הפורט הזה
    base_url = "http://localhost:3000"

    # בקשת שם לקובץ הפלט (תוצאות הבדיקה יודפסו לתוכו)
    output_filename = input("הכנס/י את שם קובץ הפלט (למשל: output_alt.txt): ")

    with open(output_filename, "w", encoding="utf-8") as output:
        # הפניית פלט ה-stdout לקובץ
        sys.stdout = output

        print("========== בדיקת פרויקט Cost Manager ==========\n")

        # 1. בדיקת נתיב 'about' – מידע על חברי הצוות
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

        # 2. בדיקת קבלת פרטי משתמש – נניח משתמש עם id=123123
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

        # 3. בדיקת הוספת פריט עלות – נשתמש בפריט חדש לדוגמה
        print("בדיקה של /api/add:")
        try:
            add_url = base_url + "/api/add"
            # נתוני עלות חדשים: נניח 'coffee 5' בקטגוריה food
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

        # 4. בדיקת הפקת דוח חודשי לאחר הוספת פריט
        print("בדיקה של /api/report:")
        try:
            # נניח שאנחנו בודקים עבור המשתמש 123123, שנת 2025, חודש 2
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
