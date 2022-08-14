import {
  Box,
  Button,
  Center,
  Checkbox,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ListPlus, MagnifyingGlass } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider } from "../../components/AuthProvider";
import { CourseRow } from "../../components/CourseRow";
import { Layout } from "../../components/Layout";
import { Course } from "../../server/types/Course";
import { User } from "../../server/types/User";

export default function AdminCoursesPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addLoading, setAddLoading] = useState(false);
  const [faculties, setFaculties] = useState<User[]>([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCredit, setCourseCredit] = useState(1);
  const [courseDepartment, setCourseDepartment] = useState("CSE");
  const [courseSection, setCourseSection] = useState(1);
  const [courseRoom, setCourseRoom] = useState(100);
  const [courseFacultyId, setCourseFacultyId] = useState("");
  const [courseMaxSeats, setCourseMaxSeats] = useState(30);
  const [courseTakenSeats, setCourseTakenSeats] = useState(0);
  const [courseCreditReq, setCourseCreditReq] = useState(0);
  const [coursePrereq, setCoursePrereq] = useState("none");
  const [courseClassSlot, setCourseClassSlot] = useState("ST");
  const [courseClassTime, setCourseClassTime] = useState("8:30 - 10:00");
  const [courseHasLab, setCourseHasLab] = useState(false);
  const [courseLabSlot, setCourseLabSlot] = useState("S");
  const [courseLabTime, setCourseLabTime] = useState("8:00 - 10:00");

  const getFaculties = async () => {
    const res = await fetch("/api/faculties");
    const data = await res.json();

    setFaculties(data.faculties);
    setCourseFacultyId(data.faculties[0]._id);
  };

  const getCourses = async () => {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    setCourses(data.courses);

    setLoading(false);
  };

  useEffect(() => {
    getCourses();
    getFaculties();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => JSON.stringify(course).toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (a.code > b.code ? 1 : a.code < b.code ? -1 : a.section - b.section));
  }, [searchTerm, courses]);

  const addCourse = async () => {
    if (!courseCode.trim() || !courseTitle.trim()) {
      return toast({
        title: "Invalid course information",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setAddLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          code: courseCode,
          title: courseTitle,
          credit: courseCredit,
          department: courseDepartment,
          section: courseSection,
          room: courseRoom,
          facultyUserId: courseFacultyId,
          maxSeats: courseMaxSeats,
          takenSeats: courseTakenSeats,
          creditRequired: courseCreditReq,
          prerequisite: coursePrereq === "none" ? null : coursePrereq,
          classSlot: courseClassSlot,
          classStart: courseClassTime.split(" - ").shift(),
          classEnd: courseClassTime.split(" - ").pop(),
          hasLab: courseHasLab,
          labSlot: courseHasLab ? courseLabSlot : null,
          labStart: courseHasLab && courseLabTime ? courseLabTime.split(" - ").shift() : null,
          labEnd: courseHasLab && courseLabTime ? courseLabTime.split(" - ").pop() : null,
        }),
      });
      const data = await res.json();

      if (data.success) {
        getCourses();
        onClose();

        setCourseCode("");
        setCourseTitle("");
        setCourseCredit(1);
        setCourseDepartment("CSE");
        setCourseSection(1);
        setCourseRoom(100);
        setCourseFacultyId(faculties[0]._id);
        setCourseMaxSeats(30);
        setCourseTakenSeats(0);
        setCourseCreditReq(0);
        setCoursePrereq("none");
        setCourseClassSlot("ST");
        setCourseClassTime("8:30 - 10:00");
        setCourseHasLab(false);
        setCourseLabSlot("S");
        setCourseLabTime("8:00 - 10:00");
      } else {
        toast({
          title: "Couldn't add course",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setAddLoading(false);
    }

    setAddLoading(false);
  };

  return (
    <AuthProvider role="admin">
      <Layout>
        <Box
          p="4"
          my="4"
          w="100%"
          mx="auto"
          maxW="7xl"
          rounded="lg"
          bg="gray.300"
          _dark={{ bg: "gray.900" }}
        >
          <Text textAlign="center" fontSize="24" fontWeight="bold">
            Manage Courses
          </Text>
          <HStack pt="6">
            <Input
              w="100%"
              value={searchTerm}
              placeholder="Search Courses"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button leftIcon={<MagnifyingGlass weight="fill" />} colorScheme="blue" minW="120">
              Search
            </Button>
            <Button
              onClick={onOpen}
              leftIcon={<ListPlus weight="fill" />}
              colorScheme="green"
              minW="140"
            >
              Add Course
            </Button>
            <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign="center">Add Course</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <HStack spacing={6} align="flex-start">
                    <Box w="5xl">
                      <FormLabel htmlFor="code">Course Code</FormLabel>
                      <Input
                        name="code"
                        placeholder="Course Code ..."
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                      />
                      <FormLabel mt="2" htmlFor="title">
                        Course Title
                      </FormLabel>
                      <Input
                        name="title"
                        placeholder="Course Title ..."
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                      />
                      <FormLabel mt="2" htmlFor="credit">
                        Course Credit
                      </FormLabel>
                      <Select
                        value={courseCredit}
                        onChange={(e) => setCourseCredit(Number(e.target.value))}
                      >
                        <option value="4.5">4.5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </Select>
                      <FormLabel mt="2" htmlFor="department">
                        Department
                      </FormLabel>
                      <Select
                        name="department"
                        value={courseDepartment}
                        onChange={(e) => setCourseDepartment(e.target.value)}
                      >
                        <option value="cse">CSE</option>
                        <option value="bba">BBA</option>
                        <option value="eng">English</option>
                        <option value="mps">Mathematical & Physical Science</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="civil">Civil Engineering</option>
                      </Select>
                      <FormLabel mt="2" htmlFor="section">
                        Section
                      </FormLabel>
                      <Input
                        min={1}
                        type="number"
                        name="section"
                        placeholder="Section ..."
                        value={courseSection}
                        onChange={(e) => setCourseSection(Number(e.target.value))}
                      />
                      <FormLabel mt="2" htmlFor="room">
                        Room No.
                      </FormLabel>
                      <Input
                        min={100}
                        type="number"
                        name="room"
                        placeholder="Room no. ..."
                        value={courseRoom}
                        onChange={(e) => setCourseRoom(Number(e.target.value))}
                      />
                      <FormLabel mt="2" htmlFor="department">
                        Faculty
                      </FormLabel>
                      <Select
                        name="faculty"
                        value={courseFacultyId}
                        onChange={(e) => setCourseFacultyId(e.target.value)}
                      >
                        {faculties.map((faculty) => (
                          <option value={faculty._id} key={faculty._id}>
                            {faculty.username}
                          </option>
                        ))}
                      </Select>
                      <FormLabel mt="2" htmlFor="prereq">
                        Course Prerequisite
                      </FormLabel>
                      <Select
                        name="prereq"
                        value={coursePrereq || "none"}
                        onChange={(e) => setCoursePrereq(e.target.value)}
                      >
                        <option value="none">None</option>
                        {[...new Set(courses.map(({ code }) => code))].map((code) => (
                          <option value={code} key={code}>
                            {code}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    <Box w="5xl">
                      <FormLabel mt="2" htmlFor="maxSeat">
                        Max Seats
                      </FormLabel>
                      <Input
                        min={0}
                        type="number"
                        name="maxSeat"
                        placeholder="Max Seats ..."
                        value={courseMaxSeats}
                        onChange={(e) => setCourseMaxSeats(Number(e.target.value))}
                      />
                      <FormLabel mt="2" htmlFor="takenSeat">
                        Seats Taken
                      </FormLabel>
                      <Input
                        min={0}
                        max={courseMaxSeats}
                        type="number"
                        name="takenSeat"
                        placeholder="Max Seats ..."
                        value={courseTakenSeats}
                        onChange={(e) => setCourseTakenSeats(Number(e.target.value))}
                      />
                      <FormLabel mt="2" htmlFor="creditReq">
                        Credit Requirement
                      </FormLabel>
                      <Input
                        min={0}
                        type="number"
                        name="creditReq"
                        placeholder="Credit Requirement ..."
                        value={courseCreditReq}
                        onChange={(e) => setCourseCreditReq(Number(e.target.value))}
                      />
                      <FormLabel mt="2" htmlFor="classSlot">
                        Class Slot
                      </FormLabel>
                      <Select
                        name="classSlot"
                        value={courseClassSlot}
                        onChange={(e) => setCourseClassSlot(e.target.value)}
                      >
                        <option value="ST">ST</option>
                        <option value="MW">MW</option>
                        <option value="TR">TR</option>
                        <option value="SR">SR</option>
                      </Select>
                      <FormLabel mt="2" htmlFor="classTime">
                        Class Time
                      </FormLabel>
                      <Select
                        name="classTime"
                        value={courseClassTime}
                        onChange={(e) => setCourseClassTime(e.target.value)}
                      >
                        <option value="8:30 - 10:00">8:30 - 10:00</option>
                        <option value="10:10 - 11:40">10:10 - 11:40</option>
                        <option value="11:50 - 1:20">11:50 - 1:20</option>
                        <option value="1:30 - 3:00">1:30 - 3:00</option>
                        <option value="3:10 - 4:40">3:10 - 4:40</option>
                        <option value="4:50 - 6:20">4:50 - 6:20</option>
                      </Select>
                      <Checkbox
                        mt={8}
                        defaultChecked={courseHasLab}
                        onChange={(e) => setCourseHasLab(e.target.checked)}
                      >
                        This course has lab
                      </Checkbox>
                      {courseHasLab && (
                        <>
                          <FormLabel mt="2" htmlFor="labSlot">
                            Lab Slot
                          </FormLabel>
                          <Select
                            name="labSlot"
                            value={courseLabSlot || "S"}
                            onChange={(e) => setCourseLabSlot(e.target.value)}
                          >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="T">T</option>
                            <option value="W">W</option>
                            <option value="R">R</option>
                          </Select>
                          <FormLabel mt="2" htmlFor="labTime">
                            Lab Time
                          </FormLabel>
                          <Select
                            name="labTime"
                            value={courseLabTime || "8:00 - 10:00"}
                            onChange={(e) => setCourseLabTime(e.target.value)}
                          >
                            <option value="8:00 - 10:00">8:00 - 10:00</option>
                            <option value="10:10 - 12:10">10:10 - 12:10</option>
                            <option value="1:30 - 3:30">1:30 - 3:30</option>
                            <option value="4:50 - 6:50">4:50 - 6:50</option>
                          </Select>
                        </>
                      )}
                    </Box>
                  </HStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={addCourse} isLoading={addLoading} colorScheme="green">
                    Add Course
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </HStack>
          <Stack spacing="4" pb="4" pt="6">
            {loading ? (
              <Center py="24">
                <Spinner color="green.500" />
              </Center>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Code</Th>
                      <Th>Title</Th>
                      <Th isNumeric>Credit</Th>
                      <Th isNumeric>Section</Th>
                      <Th isNumeric>Room</Th>
                      <Th>Timings</Th>
                      <Th>Seats</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredCourses.map((course) => (
                      <CourseRow
                        key={course._id}
                        course={course}
                        allCourses={courses}
                        getCourses={getCourses}
                        faculties={faculties}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </Box>
      </Layout>
    </AuthProvider>
  );
}
