import { Box, Center, Text } from "@chakra-ui/react";
import { AuthProvider } from "../../components/AuthProvider";

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Center bgGradient="linear(to-b, gray.700, gray.900)" w="100vw" h="100vh">
        <Box p="6" bg="gray.900" rounded="xl" maxW="md" w="100%">
          <Text pb="3" fontSize="32" fontWeight="extrabold" textAlign="center">
            Dashboard
          </Text>
        </Box>
      </Center>
    </AuthProvider>
  );
}
