import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { convertEth2Wei, formatBalance, formatChainAsNum } from "../utils/utils";

const WalletComponent = () => {
    const [hasProvider, setHasProvider] = useState(true);
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [walletTo, setWalletTo] = useState(null);
    const [value, setValue] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [message, setMessage] = useState(null);
    const [signature, setSignature] = useState(null);

    const msgParams = JSON.stringify({
        domain: {
          chainId: chainId,
          name: "Tutorial dApp Metamask",
          version: "1",
        },
    
        
        message: {
          message,
          
        },
        primaryType: "MyCustomType",
        types: {
          MyCustomType: [

            { name: "message", type: "string" }   
          ],
        },
      });

      

    useEffect(() => {
        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true });
            if (provider) {
                window.ethereum.request({
                    method: "eth_chainId",
                }).then(_chainId => setChainId(formatChainAsNum(_chainId)))
                    .catch(e => console.log(e));
                setHasProvider(true);
            } else {
                setHasProvider(false);
            }
        };
        getProvider();
    }, []);

    const handleConnect = () => {
        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts) => onAccountChanged(accounts[0]))
            .catch((e) => console.log(e));
    };

    const onAccountChanged = (address) => {
        setWallet(address);
        getBalance(address);
    };

    const getBalance = (address) => {
        window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"],
        })
            .then((_balance) => setBalance(formatBalance(_balance)))
            .catch((e) => console.log(e));
    };

    const handleWindowReload = () => {
        window.location.reload();
    };

    window.ethereum.on('accountsChanged', (accounts) => onAccountChanged(accounts[0]));
    window.ethereum.on('chainChanged', handleWindowReload);

    const handleSendTransaction = () => {
        window.ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    to: walletTo,
                    from: wallet,
                    value: convertEth2Wei(value)
                },
            ],
        })
        .then((_txHash) => setTxHash(_txHash))
        .catch(e=> console.log(e));
    };

    const handlesSignMessage = () => {
        const msgParams = JSON.stringify({
            domain: {
              chainId: chainId,
              name: "Tutorial dApp Metamask",
              version: "1",
            },
            message: {
              message,
            },
            primaryType: "MyCustomType",
            types: {
              MyCustomType: [
                { name: "message", type: "string" }
              ],
            },
        });
    
        if (message && msgParams) {
            window.ethereum.request({
            method: "eth_signTypedData_v4",                
            params: [wallet, msgParams],
            })
            .then(_signature => setSignature(_signature))
            .catch(e=> console.log(e));
        } else {
            console.error("message or msgParams is null");
        }
    }; 
    return (
        <>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text fontSize={"3xl"} fontWeight={"bold"}>
                    Tutorial dApp Metamask
                </Text>
                {hasProvider ? (
                    <Button onClick={handleConnect} isDisabled={wallet !== null}>
                        {wallet ? "Connected" : "Connect"}
                    </Button>
                ) : (
                    <Text color={"red"}>There is no provider installed</Text>
                )}
            </Flex>
            {wallet && (
            <>
            <Flex direction={"column"} mt={8} gap={4}>
                <Text fontSize={"xl"}>Wallet: {wallet}</Text>
                <Text fontSize={"xl"}>Balance: {balance}</Text>
                {chainId && <Text fontSize={"xl"}>Chain ID: {chainId}</Text>}
            </Flex>
            <Flex mt={8} direction={'column'} gap={4}>
                <Text fontSize={'2xl'} fontWeight={'bold'}>Send Transaction</Text>
                <Input placeholder="Wallet address" onChange={(e) => setWalletTo(e.target.value)}/>
                <Input placeholder="Value" onChange={(e) => setValue(e.target.value)}/>
                {txHash && <Text>TX Hash: {txHash}</Text>}
                <Button onClick={handleSendTransaction}>Send transaction</Button>
            </Flex>
            <Flex mt={8} direction={'column'} gap={4}>
                <Text fontSize={'2xl'} fontWeight={'bold'}>Sign Message</Text>
                <Input placeholder="Message to sign..." onChange={e => setMessage(e.target.value)}/>
                {signature && <Text>Signature: {signature}</Text>}
                <Button onClick={handlesSignMessage}>Sign message</Button>
            </Flex>
            </>
            )}
        </>
    );
};

export default WalletComponent;
