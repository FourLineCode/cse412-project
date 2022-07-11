import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { List } from "phosphor-react";

export function NavMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const hoverBg = useColorModeValue("gray.300", "gray.700");

  return (
    <>
      <Button
        w="10"
        h="10"
        p="1"
        variant="ghost"
        rounded="md"
        border="1px"
        borderColor="gray.600"
        cursor="pointer"
        _hover={{ bg: hoverBg }}
        onClick={onOpen}
      >
        <List width="100%" height="100%" weight="fill" />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
