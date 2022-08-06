import {
  Box,
  Button,
  Center,
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MagnifyingGlass, UserPlus } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";
import { UserCard } from "../../components/UserCard";
import { User, UserRole } from "../../server/types/User";

export default function AdminUsersPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [username, setUsername] = useState("");
  const [userDepartment, setUserDepartment] = useState("cse");
  const [password, setPassword] = useState("123456");
  const [userId, setUserId] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);

    const res = await fetch("/api/users");
    const data = await res.json();

    setUsers(data.users);

    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const addUser = async () => {
    if (!username.trim() || !password.trim() || !userId.trim()) {
      return toast({
        title: "Invalid user information",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setAddLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          role: userRole.trim(),
          id: userId.trim(),
          username: username.trim(),
          password: password.trim(),
          ...(userRole === "student" ? { department: userDepartment } : {}),
        }),
      });
      const data = await res.json();

      if (data.success) {
        getUsers();
        onClose();

        setUserRole("student");
        setUserDepartment("cse");
        setUsername("");
        setUserId("");
        setPassword("123456");
      } else {
        toast({
          title: "Couldn't add user",
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
          maxW="4xl"
          rounded="lg"
          bg="gray.300"
          _dark={{ bg: "gray.900" }}
        >
          <Text textAlign="center" fontSize="24" fontWeight="bold">
            Manage Profiles
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
              leftIcon={<UserPlus weight="fill" />}
              colorScheme="green"
              minW="120"
            >
              Add User
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign="center">Add User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormLabel htmlFor="role">User Role</FormLabel>
                  <Select
                    name="role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                  >
                    <option value="admin">Admin</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                  </Select>
                  {userRole === "student" && (
                    <>
                      <FormLabel mt="2" htmlFor="department">
                        Department
                      </FormLabel>
                      <Select
                        name="department"
                        value={userDepartment}
                        onChange={(e) => setUserDepartment(e.target.value)}
                      >
                        <option value="cse">CSE</option>
                        <option value="bba">BBA</option>
                        <option value="eng">English</option>
                        <option value="mps">Mathematical & Physical Science</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="civil">Civil Engineering</option>
                      </Select>
                    </>
                  )}
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
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={addUser} isLoading={addLoading} colorScheme="green">
                    Add User
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
              filteredUsers.map((user) => (
                <UserCard user={user} getUsers={getUsers} key={user._id} />
              ))
            )}
          </Stack>
        </Box>
      </Layout>
    </AuthProvider>
  );
}
