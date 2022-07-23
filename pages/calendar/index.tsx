import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Image from "next/image";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";

export default function CalendarPage() {
  return (
    <AuthProvider>
      <Layout>
        <Box
          p="4"
          my="4"
          w="100%"
          mx="auto"
          maxW="5xl"
          rounded="lg"
          bg="gray.300"
          _dark={{ bg: "gray.900" }}
        >
          <Text textAlign="center" fontSize="24" fontWeight="bold">
            Academic Calendar
          </Text>
          <Tabs isFitted isLazy variant="line" colorScheme="green">
            <TabList mb="1em">
              <Tab>Semester Calendar</Tab>
              <Tab>Exam Schedule</Tab>
            </TabList>
            <TabPanels>
              <TabPanel position="relative">
                <Image
                  src="/academic_calendar.png"
                  alt="academic_calendar"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
              </TabPanel>
              <TabPanel position="relative">
                <Image
                  src="/exam_schedule.png"
                  alt="academic_calendar"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Layout>
    </AuthProvider>
  );
}
