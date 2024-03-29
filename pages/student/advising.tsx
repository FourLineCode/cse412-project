import {
  Box,
  Center,
  Grid,
  GridItem,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdvisingCourseRow } from "../../components/AdvisingCourseRow";
import { AdvisingRow } from "../../components/AdvisingRow";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";
import { Advising, Course } from "../../server/types/Course";
import { useAuth } from "../../stores/useAuth";

export default function StudentAdvisingPage() {
  const { user } = useAuth();
  const [recommednedCourses, setRecommednedCourses] = useState<Course[]>([]);
  const [advisings, setAdvisings] = useState<Advising[]>([]);
  const [loading, setLoading] = useState(false);
  const [advisingLoading, setAdvisingLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const getRecommendedCourses = async () => {
    setLoading(true);

    const res = await fetch(`/api/courses/recommended?sid=${encodeURIComponent(user?.sid ?? "")}`);
    const data = await res.json();

    if (data.courses) {
      setRecommednedCourses(
        (data.courses as Course[]).sort((a, b) => a.code.localeCompare(b.code))
      );
    }

    setLoading(false);
  };

  const getAdvisings = async () => {
    setAdvisingLoading(true);

    const res = await fetch(`/api/advising?id=${encodeURIComponent(user?._id ?? "")}`);
    const data = await res.json();

    if (data.advisings) {
      setAdvisings(
        (data.advisings as Advising[]).sort((a, b) => a.course.code.localeCompare(b.course.code))
      );
    }

    setAdvisingLoading(false);
  };

  useEffect(() => {
    getRecommendedCourses();
    getAdvisings();
  }, []);

  return (
    <AuthProvider role="student">
      <Layout>
        <Grid mx="auto" maxW="8xl" my="4" templateColumns="repeat(5, 1fr)" gap="6">
          <GridItem
            p="4"
            w="100%"
            colSpan={{ base: 5, lg: 3 }}
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
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Code</Th>
                      <Th isNumeric>Section</Th>
                      <Th isNumeric>Credit</Th>
                      {/* <Th isNumeric>Room</Th> */}
                      <Th>Timings</Th>
                      <Th>Seats</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recommednedCourses.map((course) => (
                      <AdvisingCourseRow
                        course={course}
                        adding={adding}
                        setAdding={setAdding}
                        getCourses={getRecommendedCourses}
                        getAdvisings={getAdvisings}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 5, lg: 2 }}>
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
              {advisingLoading ? (
                <Center py="24">
                  <Spinner color="green.500" />
                </Center>
              ) : (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Code</Th>
                        <Th isNumeric>Section</Th>
                        <Th isNumeric>Credit</Th>
                        <Th>Timings</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {advisings.map((advising) => (
                        <AdvisingRow
                          advising={advising}
                          key={advising._id}
                          getCourses={getRecommendedCourses}
                          getAdvisings={getAdvisings}
                        />
                      ))}
                    </Tbody>
                    <TableCaption>
                      <Text fontWeight="bold" fontSize="16">
                        Total credits taken:{" "}
                        {advisings.reduce((acc, ad) => acc + ad.course.credit, 0)}
                      </Text>
                    </TableCaption>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Layout>
    </AuthProvider>
  );
}
