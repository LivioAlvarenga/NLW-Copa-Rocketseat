// JSX - JavaScript + XML(HTML)
// TSX - TypeScript + JSX

// Para importar imagem com next
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logo from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-exemple.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import {useState} from 'react';

interface HomeProps {
    poolCount: number;
    guessCount: number;
    userCount: number;
}

export default function Home(props: HomeProps) {
    // É como se fosse um estado em react que atualiza em tempo real.
    // poolTitle é a variável e setPoolTitle a função que atualiza esta variável.
    // Temos que passar um valor inicial, como é o nome do bolão, vamos deixar string vazia ""
    const [poolTitle, setPoolTitle] = useState("");

    async function createPool(event: FormEvent) {
        event.preventDefault(); //Não carrega pag ao enviar formulário

        try {
            const response = await api.post("/pools", {
                title: poolTitle,
            });

            const { code } = response.data;

            await navigator.clipboard.writeText(code);

            alert(
                "Bolão criado com sucesso, o código foi copiado para a área de transferência!"
            );

            setPoolTitle("");
        } catch (err) {
            console.log(err);
            alert("Falha ao criar o Bolão, tente novamente.");
        }
    }

    return (
        <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
            <main>
                <Image src={logo} alt="logo amarelo da NLW Copa" />
                <h1 className="mt-14 text-white font-bold text-5xl leading-tight">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </h1>
                <div className="mt-10 flex items-center gap-2 ">
                    <Image
                        src={usersAvatarExampleImg}
                        alt="Exemplo de quatro Avatares de usuários"
                    />
                    <strong className="text-gray-100 text-xl">
                        <span className="text-ignite-500">+{props.userCount}</span>{" "}
                        pessoas já estão usando
                    </strong>
                </div>
                <form className="mt-10 flex gap-2" onSubmit={createPool}>
                    <input
                        className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
                        type="text"
                        required
                        placeholder="Qual nome do seu bolão?"
                        onChange={(event) => setPoolTitle(event.target.value)}
                        value={poolTitle}
                    />
                    <button
                        className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 duration-300 ease-in-out"
                        type="submit"
                    >
                        Criar meu bolão
                    </button>
                </form>
                <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                    Após criar seu bolão, você receberá um código único que poderá usar
                    para convidar outras pessoas 🚀
                </p>
                <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
                    <div className="flex items-center gap-6">
                        <Image src={iconCheck} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">+{props.poolCount}</span>
                            <span>Bolões criados</span>
                        </div>
                    </div>
                    <div className="w-px h-14 bg-gray-600"></div>
                    <div className="flex items-center gap-6">
                        <Image src={iconCheck} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">
                                +{props.guessCount}
                            </span>
                            <span>Palpites enviados</span>
                        </div>
                    </div>
                </div>
            </main>
            <Image
                src={appPreviewImg}
                alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
                quality={100}
            />
        </div>
    );
}

export const getServerSideProps = async () => {
    const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
        api.get("pools/count"),
        api.get("guesses/count"),
        api.get("users/count"),
    ]);

    return {
        props: {
            poolCount: poolCountResponse.data.count,
            guessCount: guessCountResponse.data.count,
            userCount: userCountResponse.data.count,
        },
    };
};
