import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Pencil, Trash } from "phosphor-react";
import { createRef, useState } from "react";
import { Course } from "../server/types/Course";
import { User } from "../server/types/User";

export function CourseRow({
  course,
  faculties,
  allCourses,
  getCourses,
}: {
  course: Course;
  faculties: User[];
  allCourses: Course[];
  getCourses: () => Promise<void>;
}) {
  const toast = useToast();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
  const { isOpen: updateIsOpen, onOpen: updateOnOpen, onClose: updateOnClose } = useDisclosure();
  const cancelRef = createRef<HTMLButtonElement>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [courseCode, setCourseCode] = useState(course.code);
  const [courseTitle, setCourseTitle] = useState(course.title);
  const [courseCredit, setCourseCredit] = useState(course.credit);
  const [courseDepartment, setCourseDepartment] = useState(course.department);
  const [courseSection, setCourseSection] = useState(course.section);
  const [courseRoom, setCourseRoom] = useState(course.room);
  const [courseFacultyId, setCourseFacultyId] = useState(course.facultyUserId);
  const [courseMaxSeats, setCourseMaxSeats] = useState(course.maxSeats);
  const [courseTakenSeats, setCourseTakenSeats] = useState(course.takenSeats);
  const [courseCreditReq, setCourseCreditReq] = useState(course.creditRequired);
  const [coursePrereq, setCoursePrereq] = useState(course.prerequisite);
  const [courseClassSlot, setCourseClassSlot] = useState(course.classSlot);
  const [courseClassTime, setCourseClassTime] = useState(
    `${course.classStart} - ${course.classEnd}`
  );
  const [courseHasLab, setCourseHasLab] = useState(course.hasLab);
  const [courseLabSlot, setCourseLabSlot] = useState(course.labSlot);
  const [courseLabTime, setCourseLabTime] = useState(
    course.hasLab ? `${course.labStart} - ${course.labEnd}` : null
  );

  const onDelete = async () => {
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: course._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Deleted course successfully",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        await getCourses();
      }

      deleteOnClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setDeleteLoading(true);
    }

    setDeleteLoading(true);
  };

  const updateCourse = async () => {
    setUpdateLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: course._id,
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
        toast({
          title: "Updated course successfully",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        await getCourses();
      }

      updateOnClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setUpdateLoading(true);
    }

    setUpdateLoading(false);
  };

  return (
    <Tr>
      <Td>{course.code}</Td>
      <Td>{course.title}</Td>
      <Td isNumeric>{course.credit}</Td>
      <Td isNumeric>{course.section}</Td>
      <Td isNumeric>{course.room}</Td>
      <Td>
        <Text>{`${course.classSlot} ${course.classStart} - ${course.classEnd}`}</Text>
        {course.hasLab && (
          <Text>{`Lab ${course.labSlot} ${course.labStart} - ${course.labEnd}`}</Text>
        )}
      </Td>
      <Td>{`${course.takenSeats} / ${course.maxSeats}`}</Td>
      <Td>
        <HStack spacing={2}>
          <IconButton
            onClick={updateOnOpen}
            icon={<Pencil weight="fill" />}
            aria-label="edit-course"
          />
          <Modal isOpen={updateIsOpen} size="4xl" onClose={updateOnClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign="center">Update Course</ModalHeader>
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
                      {[...new Set(allCourses.map(({ code }) => code))].map((code) => (
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
                <Button colorScheme="blue" mr={3} onClick={updateOnClose}>
                  Close
                </Button>
                <Button onClick={updateCourse} isLoading={updateLoading} colorScheme="green">
                  Save Course
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <IconButton
            onClick={deleteOnOpen}
            icon={<Trash weight="fill" color="red" />}
            aria-label="delete-course"
          />
          <AlertDialog
            isOpen={deleteIsOpen}
            leastDestructiveRef={cancelRef}
            onClose={deleteOnClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Course
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={deleteOnClose}>
                    Cancel
                  </Button>
                  <Button isLoading={deleteLoading} colorScheme="red" onClick={onDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </HStack>
      </Td>
    </Tr>
  );
}
