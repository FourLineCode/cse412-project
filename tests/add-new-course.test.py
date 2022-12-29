from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
import time

webdriver_directory='/Users/akmal/dev/cse430/cse412-project/chromedriver'
# initialize the Chrome driver
driver = webdriver.Chrome(webdriver_directory)
driver.get("http://localhost:3000/signin/admin")
driver.maximize_window()

#Authentication
try:
    driver.find_element(By.ID, "email").send_keys('root@root.com')
    driver.find_element(By.ID, "password").click()
    driver.find_element(By.ID, "password").send_keys('root')
    driver.find_element(By.XPATH,'/html/body/div[1]/div/div/div[1]/div/button').click()
except:
    print("Authentication Error")
    driver.close()
time.sleep(0.25)

#Go to manage courses
try:
    driver.find_element(By.XPATH,'/html/body/div[1]/div/div[1]/button').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[2]/div[2]/div/div/div/div[1]').click()
    print('Manage Course Page Found')
except:
    print("Manage Course Page not Found")
    driver.close()
time.sleep(0.25)

#Delete A course
try:
    driver.find_element(By.XPATH,'/html/body/div[1]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[8]/div/button[2]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div/div[2]/div/section/footer/button[2]').click()
    print('Course Deleted')
except:
    print("Can't delete course")

try:
    driver.find_element(By.CSS_SELECTOR, ".css-qxedfq").click()
    driver.find_element(By.XPATH, "//div[@id=\'__next\']/div/div[2]/div/button[2]").click()
    print('Course add page found')
except:
    print("Course add page not found")
time.sleep(0.25)

#Add A new course
try:
    time.sleep(0.25)
    driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/section/div/div/div[1]/input[1]").send_keys('CHE109')
    driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/section/div/div/div[1]/input[2]").send_keys('Engineering Chemistry')
    driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/section/div/div/div[2]/input[1]").clear()
    driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/section/div/div/div[2]/input[1]").send_keys('40')
    driver.find_element(By.XPATH, "//input[@name='takenSeat']").clear()
    driver.find_element(By.XPATH, "//input[@name='takenSeat']").send_keys(10)
    driver.find_element(By.XPATH, "//input[@name='creditReq']").clear()
    driver.find_element(By.XPATH, "//input[@name='creditReq']").send_keys('25')
    driver.find_element(By.XPATH, "//input[@name='section']").clear()
    driver.find_element(By.XPATH, "//input[@name='section']").send_keys('1')
    driver.find_element(By.XPATH, "//input[@name='room']").clear()
    driver.find_element(By.XPATH, "//input[@name='room']").send_keys('702')
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[1]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[1]/select/option[2]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[2]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[2]/select/option[5]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[3]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[3]/select/option[5]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[4]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[1]/div[4]/select/option[7]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[1]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[1]/select/option[4]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[2]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[2]/select/option[5]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/label[6]/span[1]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[3]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[3]/select/option[1]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[4]/select').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/div/div/div[2]/div[4]/select/option[3]').click()
    driver.find_element(By.XPATH,'/html/body/div[3]/div[3]/div/section/footer/button[2]').click()
    print("Added a new course")
except:
    print("Cannot Add a new course")

time.sleep(0.25)
driver.close()
