from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
import time

webdriver_directory='/Users/akmal/dev/cse430/cse412-project/chromedriver'
# initialize the Chrome driver
driver = webdriver.Chrome(webdriver_directory)
driver.get("http://localhost:3000/signin")
driver.maximize_window()

#Authentication
try:
    driver.find_element(By.ID, "id").send_keys("2222-2-22-222")
    driver.find_element(By.ID, "password").click()
    driver.find_element(By.ID, "password").send_keys("root")
    driver.find_element(By.XPATH,'//*[@id="__next"]/div/div/div[1]/div/button').click()
    print('Authentication Succesful')
except:
    print("Authentication Error")
    driver.close()
time.sleep(0.25)

#Go to Advising Page from Menu
try:
    driver.find_element(By.XPATH,'//*[@id="__next"]/div/div[1]/button').click()
    print('Menu Button Clicked')
except:
    print("Menu button not found")
    driver.close()
time.sleep(0.25)
try:
    driver.find_element(By.XPATH,'/html/body/div[3]/div[2]/div[2]/div/div/div/div[3]').click()
    print('Advising Page Found')
except:
    print("Advising Page not Found")
    driver.close()
time.sleep(0.25)

#Drop Course
# try:
#     driver.find_element(By.XPATH,'/html/body/div[1]/div/div[2]/div[2]/div/div/table/tbody/tr[1]/td[5]/button').click()
#     print('Course Dropped')
# except:
#     print("Course Drop Error, Cannot Drop Courses")
#     driver.close()
# time.sleep(0.25)

# #Add new course
# try:
#     driver.find_element(By.CSS_SELECTOR,'#__next > div > div.css-1wsq47s > div.css-rnsoui > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > button').click()
#     print("Added Course")
# except:
#     print("Add button not found")
# time.sleep(0.25)

#Logout
try:
    driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/button').click()
    time.sleep(0.25)
    driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[2]/div/button[3]').click()
    print('Logout Successful')
except:
    print("Cannot Succesfully log out")
    driver.close()
time.sleep(0.25)

time.sleep(0.25)
driver.close()
