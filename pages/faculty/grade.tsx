import { Center, Text, VStack } from "@chakra-ui/react";
import { ClockAfternoon } from "phosphor-react";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";

export default function FacultyStudentGradePage() {
  return (
    <AuthProvider role="faculty">
      <Layout>
        <Center w="100%" h="100%" py="20">
          <VStack>
            <ClockAfternoon size={100} color="gray" />
            <Text fontSize="32" fontWeight="extrabold" color="gray">
              View Student Grades
            </Text>
            <Text fontSize="24" fontWeight="extrabold" color="gray">
              (Coming Soon)
            </Text>
          </VStack>
        </Center>
      </Layout>
    </AuthProvider>
  );
}
