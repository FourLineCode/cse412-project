import { Center, Text } from "@chakra-ui/react";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";

export default function AdminProfilesPage() {
  return (
    <AuthProvider role="admin">
      <Layout>
        <Center w="100%" h="100%" py="20">
          <Text fontSize="48" fontWeight="extrabold">
            Admin Profiles
          </Text>
        </Center>
      </Layout>
    </AuthProvider>
  );
}
