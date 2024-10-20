// Hooks
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUserToken } from "../helpers/userInfo";

// Services
import CourseServices from "../services/course.services";

// Components
import Layout from "../components/Layout";
import Loading from "../components/general/Loading";
import { CourseListCard } from "../components/Courses/CourseListCard";
import PersonalInsights from "../components/Courses/PersonalInsights";

// toasts
import { toast } from "react-toastify";

// Images
import noCoursesImage from "../assets/no-courses.png";
import { InformationCircleIcon, PencilSquareIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

/**
 * @returns HTML Element
 *
 * This page displays all courses created by the user\
 * as well as some personal insights about the user.
 */
const Courses = () => {
  // States and Hooks
  const navigate = useNavigate();
  const token = getUserToken();
  // Fetch all courses

  // TODO: Implement proper backend call once backend is ready

  const CourseManager = () => { 
    navigate("/courses/manager/0/0");
  };

  const [showTutorial, setShowTutorial] = useState(false);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const { data, error } = useSWR(token ? [token] : null, CourseServices.getAllCourses);

  if (error && error.response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
    return null;
  }

  if (!data)
    return (
      <Layout meta="course overview">
        <Loading />
      </Layout>
    );

  return (
    <Layout meta="Course overview">
      <div className="grid lg:grid-cols-[3fr_1fr] h-full">
        {/* Left side displaying courses, filtering for these and create new button */}
        <div className="m-8 p-8 pb-0 bg-white rounded-xl overflow-hidden flex flex-col">
          {data.length ? (
            <>
              {/* Conditionally render the CourseTutorial component */}
              {showTutorial && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <button className="absolute top-2 right-5 text-gray-500 hover:text-gray-700 text-3xl" onClick={handleCloseTutorial}>
                      &times;
                    </button>
                    <h1 className="text-3xl font-bold mb-4">Tutorial: Como Preencher o Formulário para Criar um Curso</h1>

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Passo 1: Nome do Curso</h2>
                    <p>
                      No campo <strong>"Nome do curso"</strong>, insira um título claro e conciso que reflita o conteúdo do seu curso. Por exemplo, se você está criando um curso sobre finanças pessoais, um bom título poderia ser{" "}
                      <em>"Gerenciamento Eficaz das Finanças Pessoais"</em>.
                    </p>
                    <h3 className="font-semibold mt-2">Dica:</h3>
                    <p>Escolha um nome que seja fácil de entender e que atraia a atenção do seu público-alvo. Evite jargões complexos.</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Passo 2: Nível</h2>
                    <p>
                      No campo <strong>"Nível"</strong>, selecione o nível de dificuldade do curso. Os níveis disponíveis são:
                    </p>
                    <ul className="list-disc ml-6">
                      <li>
                        <strong>Iniciante</strong>: Para aqueles que não têm conhecimento prévio sobre o assunto.
                      </li>
                      <li>
                        <strong>Intermediário</strong>: Para alunos que já possuem alguma base e desejam aprofundar seus conhecimentos.
                      </li>
                      <li>
                        <strong>Avançado</strong>: Para aqueles que já têm um entendimento sólido e buscam especialização.
                      </li>
                    </ul>
                    <h3 className="font-semibold mt-2">Dica:</h3>
                    <p>Se o seu curso abrange vários níveis, você pode optar por iniciar com o nível iniciante e, posteriormente, criar cursos adicionais para os níveis intermediário e avançado.</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Passo 3: Categoria</h2>
                    <p>
                      No campo <strong>"Categoria"</strong>, escolha a área em que o curso se encaixa. As categorias disponíveis incluem:
                    </p>
                    <ul className="list-disc ml-6">
                      <li>Finanças Pessoais</li>
                      <li>Saúde e Segurança no Trabalho</li>
                      <li>Costura</li>
                      <li>Eletrônica</li>
                    </ul>
                    <h3 className="font-semibold mt-2">Dica:</h3>
                    <p>Escolha a categoria que melhor descreve o conteúdo do seu curso. Isso ajudará os alunos a encontrar seu curso mais facilmente.</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Passo 4: Descrição</h2>
                    <p>
                      No campo <strong>"Descrição"</strong>, forneça uma visão geral do que os alunos podem esperar aprender com o curso. Seja claro e específico sobre os tópicos que serão abordados e os benefícios de se inscrever.
                    </p>
                    <h3 className="font-semibold mt-2">Exemplo de Descrição:</h3>
                    <p>
                      "Neste curso, você aprenderá a administrar suas finanças pessoais de maneira eficaz, incluindo orçamentos, investimentos e estratégias para economizar dinheiro. Ao final do curso, você terá as ferramentas necessárias para tomar
                      decisões financeiras informadas."
                    </p>
                    <h3 className="font-semibold mt-2">Dica:</h3>
                    <p>Use bullets para destacar os principais tópicos ou módulos do curso e inclua informações sobre os resultados que os alunos podem alcançar.</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Passo 5: Imagem de Capa</h2>
                    <p>
                      No campo <strong>"Imagem de capa"</strong>, faça o upload de uma imagem que represente visualmente o seu curso. A imagem deve ser atraente e relevante para o conteúdo.
                    </p>
                    <h3 className="font-semibold mt-2">Dica:</h3>
                    <p>Use imagens de alta qualidade que chamem a atenção e que estejam relacionadas ao tema do seu curso. Isso pode ajudar a aumentar a taxa de inscrição.</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Dicas Gerais para Criar um Bom Curso:</h2>
                    <ul className="list-disc ml-6">
                      <li>
                        <strong>Pesquise Seu Público-Alvo</strong>: Entenda as necessidades e os interesses do seu público para que você possa criar conteúdo relevante.
                      </li>
                      <li>
                        <strong>Organize o Conteúdo</strong>: Divida o curso em módulos ou seções para facilitar a navegação e o aprendizado.
                      </li>
                      <li>
                        <strong>Inclua Exemplos Práticos</strong>: Utilize estudos de caso, exemplos do mundo real ou exercícios práticos para tornar o aprendizado mais aplicável.
                      </li>
                      <li>
                        <strong>Feedback e Melhoria</strong>: Após o lançamento do curso, peça feedback dos alunos e use essas informações para melhorar o conteúdo e a apresentação do curso.
                      </li>
                    </ul>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-bold mb-4">Criando Perguntas de Múltipla Escolha</h2>
                    <p>Agora que você já tem uma seção e uma aula, pode adicionar perguntas de múltipla escolha para avaliar o conhecimento dos alunos. Para isso, siga os passos:</p>
                    <ol className="list-decimal pl-5 mb-4">
                      <li>Na área de criação de conteúdo, selecione "Criar nova pergunta".</li>
                      <li>Escolha "Múltipla Escolha" como o tipo de pergunta.</li>
                      <li>Insira o enunciado da pergunta e as opções de resposta. Lembre-se de marcar a resposta correta.</li>
                      <li>Você pode adicionar mais perguntas seguindo o mesmo processo.</li>
                    </ol>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-bold mb-4">Criando uma Nova Aula</h2>
                    <p>Para criar uma nova aula, siga estes passos:</p>
                    <ol className="list-decimal pl-5 mb-4">
                      <li>Na seção "Nova Aula", preencha o título e a descrição.</li>
                      <li>
                        Escolha o tipo de conteúdo: <strong>Vídeo</strong> ou <strong>Texto Estilizado</strong>.
                      </li>
                      <li>Se optar por vídeo, faça o upload do arquivo de vídeo ou imagem.</li>
                      <li>Depois de adicionar sua aula, considere criar algumas perguntas relacionadas ao conteúdo da aula.</li>
                    </ol>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-bold mb-4">Dica: Estruture Suas Aulas</h2>
                    <p>
                      Uma boa prática é primeiro fornecer a aula, seja em formato de texto ou vídeo, e depois adicionar perguntas para reforçar o aprendizado. Isso não só ajuda os alunos a revisar o material, mas também a entender melhor o conteúdo.
                    </p>

                    <p>Lembre-se: um curso eficaz combina teoria e prática!</p>

                    <hr className="my-4" />

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Conclusão</h2>
                    <p>Seguindo esses passos e dicas, você estará no caminho certo para criar um curso informativo e atraente nas áreas de finanças pessoais, saúde e segurança no trabalho, costura ou eletrônica. Boa sorte!</p>
                  </div>
                </div>
              )}
              {/* Header and create course button */}
              <div className="flex flex-row no-wrap">
                <h1 className="text-3xl font-bold flex-1">Confira seus cursos</h1>
                <div className="flex flex-row gap-5">
                  <label htmlFor="course-create" onClick={CourseManager} className="std-button flex modal-button space-x-2 cursor-pointer">
                    <PencilSquareIcon className="w-8 h-8" />
                    <p className="font-normal ">Criar novo curso</p> {/** Create new course */}
                  </label>
                  <label htmlFor="course-create" onClick={handleShowTutorial} className="std-button flex modal-button space-x-2 cursor-pointer">
                    <QuestionMarkCircleIcon className="w-8 h-8" />
                    <p className="font-normal ">Como criar</p> {/** Create new course */}
                  </label>
                </div>
              </div>
              {/* Card/compact view toggle and filters */}
              <div className="h-10 my-8 bg-grayLight">
                {/* TODO: Implement card/compact view toggle */}

                {/* TODO: Implement filters */}
              </div>
              <div className="overflow-y-scroll no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 pb-4">
                  {data.map((course: any, key: number) => (
                    <CourseListCard course={course} key={key} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // If the user has no courses, display this 'empty state'
            <div className="grid place-content-center w-full h-full text-center">
              <div className="md:mx-40 xl:mx-64">
                <img src={noCoursesImage} className="w-full" />
                <h1 className="text-xl font-bold my-4">Comece agora</h1>
                {/* You haven't created any courses yet.
              Click the button below and follow the
              step-by-step instructions to develop your first course. */}
                <p>Você ainda não criou nenhum curso. Clique no botão abaixo e siga o passo a passo para desenolver o seu primeiro curso.</p>
                {/* Create course button */}
                <label htmlFor="course-create" onClick={CourseManager} className="std-button flex modal-button  space-x-2">
                  <PencilSquareIcon className="w-5 h-5" />
                  <p className="font-normal ">Criar novo curso</p> {/** Create new course */}
                </label>
              </div>
            </div>
          )}
        </div>
        {/* Right side displaying personal insights */}
        <div className="m-8 hidden lg:block">
          <PersonalInsights courses={data} />
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
