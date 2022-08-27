import { Avatar, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { User } from "../server/types/User";

export function StudentCard({ user }: { user: User }) {
  const router = useRouter();

  return (
    <HStack
      px="4"
      py="2"
      bg="gray.800"
      rounded="md"
      cursor="pointer"
      _hover={{ bg: "gray.700" }}
      onClick={() => router.push(`/faculty/student/${user._id}`)}
    >
      <Flex justify="space-between" w="full">
        <HStack spacing="4">
          <Avatar name={user.username} />
          <Stack spacing="0">
            <Text fontSize="16" fontWeight="bold">
              {user.username}
            </Text>
            <Text fontSize="12" fontWeight="semibold" color="gray.400">
              {user.role.toUpperCase()}
            </Text>
          </Stack>
        </HStack>
      </Flex>
    </HStack>
  );
}
