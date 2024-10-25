import {
  Button,
  Flex,
  Image,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLoginClick = () => {
    navigate("/login");
    onClose();
  };

  const handleListClick = () => {
    navigate("/list");
    onClose();
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      padding="1.5rem 2rem"
      backgroundColor="#fff"
      boxShadow="sm"
    >
      {/* Logo */}
      <Image
        src="wishome.png"
        alt="Wishome Logo"
        height={"100px"}
        width={"auto"}
        onClick={handleHomeClick}
      />

      {/* Desktop Navigation */}
      <Flex display={{ base: "none", md: "flex" }} gap={10} fontSize="lg">
        <Button
          variant="link"
          color="#6d1716"
          fontFamily="'Lato', sans-serif"
          onClick={handleListClick}
        >
          LISTA
        </Button>
        <Button
          variant="link"
          color="#6d1716"
          fontFamily="'Lato', sans-serif"
          onClick={handleLoginClick}
        >
          LOGIN
        </Button>
      </Flex>

      {/* Mobile Menu (Icon) */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        aria-label="Open menu"
        icon={<FaBars />} // Usa o ícone de FaBars para o menu
        onClick={onOpen}
        variant="outline"
      />

      {/* Drawer for Mobile Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing="24px">
              <Button
                variant="link"
                color="#6d1716"
                fontFamily="'Lato', sans-serif"
                onClick={handleListClick}
              >
                LISTA
              </Button>
              <Button
                variant="link"
                color="#6d1716"
                fontFamily="'Lato', sans-serif"
                onClick={handleLoginClick}
              >
                LOGIN
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default NavBar;
