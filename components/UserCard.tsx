import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Pencil, Trash } from "phosphor-react";
import { createRef, useState } from "react";
import { User } from "../server/types/User";

export function UserCard({ user, getUsers }: { user: User; getUsers: () => Promise<void> }) {
  const toast = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
  const { isOpen: updateIsOpen, onOpen: updateOnOpen, onClose: updateOnClose } = useDisclosure();
  const cancelRef = createRef<HTMLButtonElement>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const onDelete = async () => {
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Deleted user successfully",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        await getUsers();
      }

      deleteOnClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setDeleteLoading(true);
    }

    setDeleteLoading(true);
  };

  return (
    <HStack bg="gray.800" rounded="md" cursor="pointer" _hover={{ bg: "gray.700" }} px="4" py="2">
      <Flex justify="space-between" w="full">
        <HStack spacing="4">
          <Avatar name={user.username} />
          <Stack spacing="0">
            <Text fontSize="16">{user.username}</Text>
            <Text fontSize="12" color="gray.400">
              {user.role.toUpperCase()}
            </Text>
          </Stack>
        </HStack>
        <HStack spacing={2}>
          <IconButton icon={<Pencil weight="fill" />} aria-label="edit-user" />
          <IconButton
            onClick={deleteOnOpen}
            icon={<Trash weight="fill" color="red" />}
            aria-label="delete-user"
          />
          <AlertDialog
            isOpen={deleteIsOpen}
            leastDestructiveRef={cancelRef}
            onClose={deleteOnClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete User
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={deleteOnClose}>
                    Cancel
                  </Button>
                  <Button isLoading={deleteLoading} colorScheme="red" onClick={onDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </HStack>
      </Flex>
    </HStack>
  );
}
