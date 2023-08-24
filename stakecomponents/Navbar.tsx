// import { Container, Flex, Heading } from "@chakra-ui/react";
// import { ConnectWallet } from "@thirdweb-dev/react";

// export default function Navbar() {
//     return (
//         <Container maxW={"1200px"} py={4}>
//             <Flex direction={"row"} justifyContent={"space-between"}>
//                 <Heading>Token Staking App</Heading>
//                 <ConnectWallet />
//             </Flex>
//         </Container>
//     )
// }

import { Container, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Navbar() {
    const flexDirection = useBreakpointValue({ base: "column", md: "row" }) as "column" | "row";
    const justifyContent = useBreakpointValue({ base: "center", md: "space-between" }) as "center" | "space-between";

    return (
        <Container  maxW={"1200px"} py={4}>
            <Flex  direction={flexDirection} justifyContent={justifyContent} alignItems="center" wrap="wrap">
                <Heading mb={{ base: 2, md: 0 }}> <span style={{ color: "#FF914D" }}>FlowFarm</span> Staking</Heading>
                <ConnectWallet />
            </Flex>
        </Container>
    )
}
