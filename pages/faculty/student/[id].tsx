import {
  Avatar,
  Box,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthProvider } from "../../../components/AuthProvider";
import { Layout } from "../../../components/Layout";
import { DepartmentCode, DepartmentMap } from "../../../server/types/Department";
import { User } from "../../../server/types/User";

export default function StudentProfilePage() {
  const router = useRouter();
  const userId = router.query.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    setLoading(true);

    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();

    if (data.user) {
      setUser(data.user);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthProvider>
      <Layout>
        <Box
          py="4"
          px={{ base: "4", lg: "16" }}
          my="4"
          w="100%"
          mx="auto"
          maxW="4xl"
          rounded="lg"
          bg="gray.300"
          _dark={{ bg: "gray.900" }}
        >
          <Text textAlign="center" fontSize="24" fontWeight="bold">
            Student Profile
          </Text>
          {loading ? (
            <Center py="24">
              <Spinner color="green.500" />
            </Center>
          ) : (
            user && (
              <Box display="flex" flexDirection={{ base: "column", lg: "row" }} mt="8">
                <Box mt="8" mx={{ base: "auto", lg: "none" }}>
                  <Avatar name={user.username} w="32" h="32" />
                </Box>
                <Box ml={{ base: "0", lg: "8" }} w="100%" fontSize="18" fontWeight="semibold">
                  <TableContainer>
                    <Table variant="unstyled">
                      <Tbody>
                        <Tr>
                          <Td color="gray.400">Name:</Td>
                          <Td>{user.username}</Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Student ID:</Td>
                          <Td>{user.sid}</Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Department:</Td>
                          <Td>{DepartmentMap[user.department as DepartmentCode] || "None"}</Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Program:</Td>
                          <Td color="gray.500" fontStyle="italic">
                            NA
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Completed Credits:</Td>
                          <Td>{user.completedCredit}</Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Current CGPA:</Td>
                          <Td>{user.grade?.toFixed(2)}</Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Date of Birth:</Td>
                          <Td color="gray.500" fontStyle="italic">
                            NA
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="gray.400">Blood Group:</Td>
                          <Td color="gray.500" fontStyle="italic">
                            NA
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Layout>
    </AuthProvider>
  );
}
