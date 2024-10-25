import {
  Flex,
  Image,
} from "@chakra-ui/react";

const NavBar = () => {
  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      padding="0.5rem 2rem"
      backgroundColor="#efedee"
      boxShadow="sm"
    >
      {/* Logo */}
      <Image
        src="logo.png"
        alt="Magna Advogados"
        height={"50px"}
        width={"auto"}
      />  
    </Flex>
  );
};

export default NavBar;
