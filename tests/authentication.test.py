from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

webdriver_directory='/Users/akmal/dev/cse430/cse412-project/chromedriver'
# initialize the Chrome driver
driver = webdriver.Chrome(webdriver_directory)

def test_Login_std(username,password,i):
    driver.get("http://localhost:3000/signin")
    driver.maximize_window()
    driver.find_element(By.ID, "id").send_keys(username)
    driver.find_element(By.ID, "password").click()
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH,'//*[@id="__next"]/div/div/div[1]/div/button').click()
    time.sleep(0.25)
    get_url= driver.current_url
    if(get_url=="http://localhost:3000/home"):
        print("test- ",str(i)," successfully logged in",'\nUsername:',username,'\nPassword:',password)
        try:
            driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/button').click()
            time.sleep(0.25)
            driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[2]/div/button[3]').click()
            print('Logout Successful')
        except:
            print("Cannot Succesfully log out")

    else:
        print("test- ",str(i)," failed to logged in",'\nUsername:',username,'\nPassword:',password)

def test_Login_fac(username,password,i):
    driver.get("http://localhost:3000/signin/admin")
    driver.maximize_window()
    driver.find_element(By.ID, "email").send_keys(username)
    driver.find_element(By.ID, "password").click()
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH,'/html/body/div[1]/div/div/div[1]/div/button').click()
    time.sleep(0.25)
    get_url= driver.current_url
    if(get_url=="http://localhost:3000/home"):
        print("test- ",str(i)," successfully logged in",'\nUsername:',username,'\nPassword:',password)
        try:
            driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/button').click()
            time.sleep(0.25)
            driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[2]/div/button[3]').click()
            print('Logout Successful')
        except:
            print("Cannot Succesfully log out")

    else:
        print("test- ",str(i)," failed to logged in",'\nUsername:',username,'\nPassword:',password)



username_std=['2019-2-31-222','2019-1-32-222','2019-2-31-22','','2222-2-22-222']
pass_std=['1234','0123','123','999','root']
for i in range(0,len(username_std)):
    test_Login_std(username_std[i],pass_std[i],i+1)
time.sleep(0.25)


username_fac=['a@a.com','smahmud@gmail.com','afridi@gmail.com','','faculty@root.com']
pass_fac=['1234','0123','123','999','root']
for i in range(0,len(username_fac)):
    test_Login_fac(username_fac[i],pass_fac[i],i+1)


username_adm=['a@a.com','smahmud@gmail.com','afridi@gmail.com','','root@root.com']
pass_adm=['1234','0123','123','999','root']
for i in range(0,len(username_adm)):
    test_Login_fac(username_adm[i],pass_adm[i],i+1)

time.sleep(0.25)
driver.close()
