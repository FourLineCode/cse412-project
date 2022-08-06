import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  IconButton,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Pencil, Trash } from "phosphor-react";
import { createRef, useState } from "react";
import { Course } from "../server/types/Course";

export function CourseRow({
  course,
  getCourses,
}: {
  course: Course;
  getCourses: () => Promise<void>;
}) {
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
      const res = await fetch("/api/courses", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: course._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Deleted course successfully",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        await getCourses();
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
    <Tr>
      <Td>{course.code}</Td>
      <Td>{course.title}</Td>
      <Td isNumeric>{course.credit}</Td>
      <Td isNumeric>{course.section}</Td>
      <Td isNumeric>{course.room}</Td>
      <Td>
        <Text>{`${course.classSlot} ${course.classStart} - ${course.classEnd}`}</Text>
        {course.hasLab && (
          <Text>{`Lab ${course.labSlot} ${course.labStart} - ${course.labEnd}`}</Text>
        )}
      </Td>
      <Td>{`${course.takenSeats} / ${course.maxSeats}`}</Td>
      <Td>
        <HStack spacing={2}>
          <IconButton icon={<Pencil weight="fill" />} aria-label="edit-course" />
          <IconButton
            onClick={deleteOnOpen}
            icon={<Trash weight="fill" color="red" />}
            aria-label="delete-course"
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
      </Td>
    </Tr>
  );
}
