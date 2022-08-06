import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

export default function AdminCoursesPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addLoading, setAddLoading] = useState(false);

  const getCourses = async () => {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    setCourses(data.courses);

    setLoading(false);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => JSON.stringify(course).toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (a.code > b.code ? 1 : a.code < b.code ? -1 : 0));
  }, [searchTerm, courses]);

  const addCourse = async () => {
    // if (!username.trim() || !password.trim() || !userId.trim()) {
    //   return toast({
    //     title: "Invalid user information",
    //     status: "error",
    //     duration: 3000,
    //     isClosable: false,
    //   });
    // }

    setAddLoading(true);

    try {
      // const res = await fetch("/api/users", {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     role: userRole.trim(),
      //     id: userId.trim(),
      //     username: username.trim(),
      //     password: password.trim(),
      //   }),
      // });
      // const data = await res.json();
      // if (data.success) {
      //   getCourses();
      //   onClose();
      //   setUserRole("student");
      //   setUsername("");
      //   setUserId("");
      //   setPassword("123456");
      // } else {
      //   toast({
      //     title: "Couldn't add user",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: false,
      //   });
      // }
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
              placeholder="Search Users"
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
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign="center">Add Course</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {/* <FormLabel htmlFor="role">User Role</FormLabel>
                  <Select
                    name="role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                  >
                    <option value="admin">Admin</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                  </Select>
                  <FormLabel mt="2" htmlFor="id">
                    User ID/Email
                  </FormLabel>
                  <Input
                    name="id"
                    placeholder="User ID/Email ..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <FormLabel mt="2" htmlFor="username">
                    Username
                  </FormLabel>
                  <Input
                    name="username"
                    placeholder="Username ..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FormLabel mt="2" htmlFor="password">
                    Default Password
                  </FormLabel>
                  <Input
                    name="password"
                    placeholder="Default Password ..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  /> */}
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
                      <CourseRow key={course._id} course={course} getCourses={getCourses} />
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
