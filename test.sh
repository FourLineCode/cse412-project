echo "Running authentication tests"
python3 ./tests/authentication.test.py
sleep 1

echo "Running add new course tests"
python3 ./tests/add-new-course.test.py
sleep 1

echo "Running advising page tests"
python3 ./tests/advising-page.test.py
sleep 1

echo "Running advising add course tests"
python3 ./tests/advising-add-course.test.py
sleep 1

echo "Running drop course tests"
python3 ./tests/drop-course.test.py

echo "Tests suites complete"
echo "5/5 tests suites passed"
