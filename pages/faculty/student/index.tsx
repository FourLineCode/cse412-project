import { Box, Button, Center, HStack, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider } from "../../../components/AuthProvider";
import { Layout } from "../../../components/Layout";
import { StudentCard } from "../../../components/StudentCard";
import { User } from "../../../server/types/User";

export default function FacultyStudentProfilePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
    return users.filter(
      (user) =>
        user.role === "student" &&
        JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  return (
    <AuthProvider role="faculty">
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
            View Student Profile
          </Text>
          <HStack pt="6">
            <Input
              w="100%"
              value={searchTerm}
              placeholder="Search Students..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button leftIcon={<MagnifyingGlass weight="fill" />} colorScheme="blue" minW="120">
              Search
            </Button>
          </HStack>
          <Stack spacing="4" pb="4" pt="6">
            {loading ? (
              <Center py="24">
                <Spinner color="green.500" />
              </Center>
            ) : (
              filteredUsers.map((user) => <StudentCard user={user} key={user._id} />)
            )}
          </Stack>
        </Box>
      </Layout>
    </AuthProvider>
  );
}
