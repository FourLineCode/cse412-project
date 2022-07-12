import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Moon, SignOut, Sun, User } from "phosphor-react";
import { useAuth } from "../stores/useAuth";
import { NavMenu } from "./NavMenu";

export function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const badgeColor =
    user?.role === "admin" ? "yellow.600" : user?.role === "faculty" ? "red.500" : "green.500";

  return (
    <Box
      width="100%"
      bg="gray.300"
      h="16"
      px="5"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      _dark={{ bg: "gray.900" }}
    >
      <NavMenu />
      <HStack>
        <VStack spacing="1" align="end">
          <Text fontWeight="semibold">{user?.username}</Text>
          <Box bg={badgeColor} py="0.5" px="1.5" rounded="full">
            <Text fontSize="10" fontWeight="bold">
              {user?.role.toUpperCase()}
            </Text>
          </Box>
        </VStack>
        <Menu>
          <MenuButton>
            <Avatar
              name={user?.username}
              _hover={{ border: "2px", borderColor: badgeColor }}
              cursor="pointer"
            />
          </MenuButton>
          <MenuList>
            <MenuItem icon={<User weight="fill" />}>View Profile</MenuItem>
            <MenuItem
              icon={colorMode === "light" ? <Moon weight="fill" /> : <Sun weight="fill" />}
              onClick={toggleColorMode}
            >
              Toggle Dark Mode
            </MenuItem>
            <MenuItem
              icon={<SignOut weight="fill" />}
              onClick={() => {
                signOut();
                router.push("/signin");
              }}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
}
