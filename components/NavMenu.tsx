import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { default as NextLink } from "next/link";
import {
  Calculator,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Clock,
  Exam,
  FolderSimplePlus,
  Icon,
  List,
  Notebook,
  Student,
  Upload,
  User,
  UserGear,
} from "phosphor-react";
import { useAuth } from "../stores/useAuth";

export function NavMenu() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <DrawerBody pt="16" px="4">
            <Stack direction="column" w="100%" spacing="3">
              {user?.role === "admin" ? (
                <>
                  <NavMenuItem
                    route="/admin/course"
                    label="Manage Courses"
                    icon={FolderSimplePlus}
                  />
                  <NavMenuItem route="/admin/profiles" label="Manage Profiles" icon={UserGear} />
                  <NavMenuItem route="/admin/schedule" label="Schedule Advising" icon={Clock} />
                  <NavMenuItem route="/admin/calendar" label="Edit Calendar" icon={CalendarPlus} />
                </>
              ) : user?.role === "faculty" ? (
                <>
                  <NavMenuItem route="/faculty/profile" label="Profile" icon={User} />
                  <NavMenuItem route="/faculty/student" label="Student Profile" icon={Student} />
                  <NavMenuItem route="/faculty/grade" label="Student Grade Report" icon={Exam} />
                  <NavMenuItem route="/calendar" label="Academic Calendar" icon={Calendar} />
                  <NavMenuItem route="/faculty/submit" label="Submit Result" icon={Upload} />
                </>
              ) : user?.role === "student" ? (
                <>
                  <NavMenuItem route="/student/profile" label="Profile" icon={User} />
                  <NavMenuItem route="/student/grade" label="Grade Report" icon={Exam} />
                  <NavMenuItem route="/student/advising" label="Advising" icon={Notebook} />
                  <NavMenuItem
                    route="/student/schedule"
                    label="Class Schedule"
                    icon={CalendarCheck}
                  />
                  <NavMenuItem route="/calendar" label="Academic Calendar" icon={Calendar} />
                  <NavMenuItem
                    route="/student/calculator"
                    label="CGPA Calculator"
                    icon={Calculator}
                  />
                </>
              ) : null}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface NavMenuItemProps {
  route: string;
  icon: Icon;
  label: string;
}

function NavMenuItem({ route, icon: IconComponent, label }: NavMenuItemProps) {
  return (
    <NextLink href={route}>
      <Link
        as={HStack}
        spacing="2"
        w="100%"
        p="4"
        bg="gray.300"
        _hover={{ bg: "gray.400" }}
        _dark={{ bg: "gray.600", _hover: { bg: "gray.500" } }}
        rounded="lg"
      >
        <IconComponent weight="fill" size="28" />
        <Text fontSize="18" fontWeight="bold">
          {label}
        </Text>
      </Link>
    </NextLink>
  );
}
