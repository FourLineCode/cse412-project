import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Pencil, Trash } from "phosphor-react";
import { createRef, useState } from "react";
import { User, UserRole } from "../server/types/User";

export function UserCard({ user, getUsers }: { user: User; getUsers: () => Promise<void> }) {
  const toast = useToast();
  const [showActions, setShowActions] = useState(false);
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
  const { isOpen: updateIsOpen, onOpen: updateOnOpen, onClose: updateOnClose } = useDisclosure();
  const cancelRef = createRef<HTMLButtonElement>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(user.role);
  const [username, setUsername] = useState(user.username);
  const [userDepartment, setUserDepartment] = useState(user.department ?? "cse");
  const [userId, setUserId] = useState(user.sid || user.email || "");
  const [userCredit, setUserCredit] = useState(user.completedCredit ?? "0");
  const [userGrade, setUserGrade] = useState(user.grade ?? "0");
  const [userActivated, setUserActivated] = useState(user.activated);

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

  const updateUser = async () => {
    setUpdateLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
          username,
          email: userId,
          sid: userId,
          role: userRole,
          activated: userActivated,
          department: userDepartment,
          completedCredit: Number(userCredit),
          grade: Number(userGrade),
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Updated user successfully",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        await getUsers();
      }

      updateOnClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setUpdateLoading(true);
    }

    setUpdateLoading(false);
  };

  return (
    <HStack
      px="4"
      py="2"
      bg="gray.100"
      _dark={{ bg: "gray.800" }}
      rounded="md"
      cursor="pointer"
      _hover={{ opacity: 0.75 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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
        {showActions && (
          <HStack spacing={2}>
            <IconButton
              onClick={updateOnOpen}
              icon={<Pencil weight="fill" />}
              aria-label="edit-user"
            />
            <Modal isOpen={updateIsOpen} onClose={updateOnClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign="center">Update User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormLabel htmlFor="role">User Role</FormLabel>
                  <Select
                    name="role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                  >
                    <option value="admin">Admin</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                  </Select>
                  {userRole === "student" && (
                    <>
                      <FormLabel mt="2" htmlFor="department">
                        Department
                      </FormLabel>
                      <Select
                        name="department"
                        value={userDepartment}
                        onChange={(e) => setUserDepartment(e.target.value)}
                      >
                        <option value="cse">CSE</option>
                        <option value="bba">BBA</option>
                        <option value="eng">English</option>
                        <option value="mps">Mathematical & Physical Science</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="civil">Civil Engineering</option>
                      </Select>
                    </>
                  )}
                  <FormLabel mt="2" htmlFor="id">
                    User ID/Email
                  </FormLabel>
                  <Input
                    name="id"
                    placeholder="User ID/Email ..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <FormLabel mt="2" htmlFor="username">
                    Username
                  </FormLabel>
                  <Input
                    name="username"
                    placeholder="Username ..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {userRole === "student" && (
                    <>
                      <FormLabel mt="2" htmlFor="credit">
                        Completed Credit
                      </FormLabel>
                      <Input
                        name="credit"
                        placeholder="Credit ..."
                        value={userCredit}
                        type="number"
                        onChange={(e) => setUserCredit(e.target.value)}
                      />
                      <FormLabel mt="2" htmlFor="grade">
                        Grade
                      </FormLabel>
                      <Input
                        min={0}
                        max={4}
                        type="number"
                        name="grade"
                        placeholder="Grade ..."
                        value={userGrade}
                        onChange={(e) => setUserGrade(e.target.value)}
                      />
                    </>
                  )}
                  <Checkbox
                    mt="2"
                    defaultChecked={userActivated}
                    onChange={(e) => setUserActivated(e.target.checked)}
                  >
                    User Account Activated
                  </Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={updateOnClose}>
                    Close
                  </Button>
                  <Button onClick={updateUser} isLoading={updateLoading} colorScheme="green">
                    Save User
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
        )}
      </Flex>
    </HStack>
  );
}
