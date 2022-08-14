import {
  Box,
  Center,
  Grid,
  GridItem,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdvisingCourseRow } from "../../components/AdvisingCourseRow";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";
import { Course } from "../../server/types/Course";
import { useAuth } from "../../stores/useAuth";

export default function StudentAdvisingPage() {
  const { user } = useAuth();
  const [recommednedCourses, setRecommednedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const getRecommendedCourses = async () => {
    setLoading(true);

    const res = await fetch(`/api/courses/recommended?sid=${encodeURIComponent(user?.sid ?? "")}`);
    const data = await res.json();

    if (data.courses) {
      setRecommednedCourses(
        (data.courses as Course[]).sort((a, b) =>
          a.code > b.code ? 1 : a.code < b.code ? -1 : a.section - b.section
        )
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    getRecommendedCourses();
  }, []);

  return (
    <AuthProvider role="student">
      <Layout>
        <Grid mx="auto" maxW="8xl" my="4" templateColumns="repeat(5, 1fr)" gap="6">
          <GridItem
            p="4"
            w="100%"
            colSpan={3}
            rounded="lg"
            bg="gray.300"
            _dark={{ bg: "gray.900" }}
          >
            <Text textAlign="center" fontSize="20" mb="4" fontWeight="bold">
              Recommended Courses
            </Text>
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
                      <Th isNumeric>Section</Th>
                      <Th isNumeric>Credit</Th>
                      <Th isNumeric>Room</Th>
                      <Th>Timings</Th>
                      <Th>Seats</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recommednedCourses.map((course) => (
                      <AdvisingCourseRow course={course} adding={adding} setAdding={setAdding} />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </GridItem>
          <GridItem colSpan={2}>
            <Box
              p="4"
              top="4"
              w="100%"
              rounded="lg"
              bg="gray.300"
              position="sticky"
              _dark={{ bg: "gray.900" }}
            >
              <Text textAlign="center" fontSize="20" mb="4" fontWeight="bold">
                Advised Courses
              </Text>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Code</Th>
                      <Th isNumeric>Section</Th>
                      <Th isNumeric>Credit</Th>
                      {/* <Th isNumeric>Room</Th> */}
                      <Th>Timings</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody></Tbody>
                </Table>
              </TableContainer>
            </Box>
          </GridItem>
        </Grid>
      </Layout>
    </AuthProvider>
  );
}
