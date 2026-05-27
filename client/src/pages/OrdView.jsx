const API_BASE_URL = import.meta.env.VITE_API_URL;
import { Link } from "react-router-dom"; // Не забудь импортировать Link в начале файла
import {
  Title,
  Button,
  Group,
  Stack,
  Text,
  Paper,
  Stepper,
  Flex,
  AspectRatio,
  Anchor,
  Alert,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCanary,
} from "@tabler/icons-react";
import { SegmentedControl } from "@mantine/core";
import { useState } from "react";

export default function OrdView() {
  const [docType, setTypeDoc] = useState("noBookmarks");
  const [esedType, setEsedType] = useState("otchet");
  const [active, setActive] = useState(0);

  return (
    <>
      <Stack>
        <Title order={2}>Скачать готовые бланки</Title>
        <SegmentedControl
          value={docType}
          size="md"
          onChange={setTypeDoc}
          data={[
            { label: "Обычный", value: "noBookmarks" },
            { label: "Для ЕСЭД", value: "withBookmarks" },
          ]}
        />{" "}
        {docType === "noBookmarks" && (
          <>
            <Paper shadow="md" withBorder p="xl">
              <Text>Официальные бланки ССМП</Text>
              <Group justify="center">
                <Button
                  onClick={() => {
                    // 1. Создаем прямую ссылку на файл
                    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/blank_pisma.docx`;

                    // 2. Создаем временный элемент ссылки
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.setAttribute("download", "Бланк_Письма.docx"); // Атрибут download заставляет браузер скачивать
                    link.setAttribute("target", "_blank");

                    // 3. Добавляем в DOM, кликаем и удаляем
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Бланк Письма
                </Button>
                <Button
                  onClick={() => {
                    // 1. Создаем прямую ссылку на файл
                    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/blank_prikaza.docx`;

                    // 2. Создаем временный элемент ссылки
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.setAttribute("download", "Бланк_Письма.docx"); // Атрибут download заставляет браузер скачивать
                    link.setAttribute("target", "_blank");

                    // 3. Добавляем в DOM, кликаем и удаляем
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Бланк Приказа
                </Button>
              </Group>
            </Paper>
          </>
        )}
        {docType === "withBookmarks" && (
          <>
            <Paper shadow="md" withBorder p="xl">
              <Text>Утвержденные бланки с закладками для ЕСЭД</Text>
              <Group justify="center">
                <Button
                  onClick={() => {
                    // 1. Создаем прямую ссылку на файл
                    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/blank_pisma_esed.docx`;

                    // 2. Создаем временный элемент ссылки
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.setAttribute("download", "Бланк_Письма_ЕСЭД.docx"); // Атрибут download заставляет браузер скачивать
                    link.setAttribute("target", "_blank");

                    // 3. Добавляем в DOM, кликаем и удаляем
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Бланк Письма ЕСЭД
                </Button>
                <Button
                  onClick={() => {
                    // 1. Создаем прямую ссылку на файл
                    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/blank_prikaza_esed.docx`;

                    // 2. Создаем временный элемент ссылки
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.setAttribute("download", "Бланк_Письма_ЕСЭД.docx"); // Атрибут download заставляет браузер скачивать
                    link.setAttribute("target", "_blank");

                    // 3. Добавляем в DOM, кликаем и удаляем
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Бланк Приказа ЕСЭД
                </Button>
              </Group>
            </Paper>
          </>
        )}
        <Title ta="center" order={2}>
          Как работать с ЕСЭД
        </Title>
        <Stack>
          <Text ta="center" fw={500}>
            Для того чтобы зайти необходимо перейти на сайт ЕСЭД по ссылке{" "}
            <Anchor
              href="https://esed.sakha.gov.ru"
              target="_blank"
              rel="noreferrer"
            >
              https://esed.sakha.gov.ru
            </Anchor>
            , затем ввести свой <b>логин</b> и <b>пароль</b>.
            <Alert
              variant="light"
              color="yellow"
              title="Предупреждение"
              icon={<IconAlertCircle />}
            >
              Иногда при нестабильной работе ЕСЭД или больших данных, открытие
              документа может занимать время
            </Alert>
          </Text>
          <AspectRatio ratio={16 / 9} maw={800} mx="auto">
            <video
              src={`${API_BASE_URL}/uploads/esed/kak_zaiti_to.mp4`}
              controls // Показывает стандартные кнопки управления (play, pause, громкость)
              poster={`${API_BASE_URL}/uploads/esed/preview_image.png`} // Превью перед запуском
              style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
            />
          </AspectRatio>
        </Stack>
        <SegmentedControl
          value={esedType}
          onChange={setEsedType}
          data={[
            { label: "Как написать", value: "novoe" },
            { label: "Как отчитаться", value: "otchet" },
          ]}
        />
        {esedType === "otchet" && (
          <>
            <Paper shadow="md" withBorder p="xl">
              {/* Используем Flex вместо Group, выравниваем по верхнему краю */}
              <Flex gap="xl" align="flex-start" wrap="nowrap">
                {/* Левая колонка: Степпер с фиксированной шириной */}
                <Stepper
                  w={250} // Самый удобный способ задать ширину в Mantine (250px)
                  active={active}
                  onStepClick={setActive}
                  orientation="vertical"
                >
                  <Stepper.Step label="Шаг 1" description="Перейти в раздел" />
                  <Stepper.Step label="Шаг 2" description="Открыть документ" />
                  <Stepper.Step label="Шаг 3" description="Создать связку" />
                  <Stepper.Step
                    label="Шаг 4"
                    description="Заполняем наш отчет"
                  />
                  <Stepper.Step
                    label="Шаг 5"
                    description="Следим за статусом"
                  />
                  <Stepper.Step label="Шаг 6" description="Финал" />
                </Stepper>
                {/* Правая колонка: Динамический контент, который займет всё оставшееся место */}
                <Stack style={{ flex: 1 }}>
                  {active === 0 && (
                    <>
                      <Text>
                        {" "}
                        Перейти в раздел <b>"Документы на исполнении"</b>,
                        внутри этого раздела лежат все документы которые были
                        направлены Вам как поручение И по которым Вам необходимо{" "}
                        <b>отчитаться</b>
                      </Text>
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_1.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Так же внутри разделов документы можно фильтровать для
                        удобства по колонкам
                      </Alert>
                    </>
                  )}
                  {active === 1 && (
                    <>
                      <Text>
                        Внутри раздела необходимо выбрать документ по которому
                        необходимо отчитаться и открыть его нажав по номеру
                        документа (так же как на видео)
                      </Text>
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_2.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Text>
                        В итоге у вас должен открыться сам документ, где вы
                        можете ознакомиться с содержанием поручения и
                        электронным документом
                      </Text>
                      <Alert
                        variant="light"
                        color="yellow"
                        title="Предупреждение"
                        icon={<IconAlertCircle />}
                      >
                        Иногда при нестабильной работе ЕСЭД или больших данных,
                        открытие документа может занимать время
                      </Alert>
                    </>
                  )}
                  {active === 2 && (
                    <>
                      <Text>
                        Ознакомившись с документом по которому нам необходимо
                        отчитаться, необходимо нажать{" "}
                        <b>Регистрировать связанный проект/копию</b>, таким
                        образом мы создаем новый документ (наш отчет), НО
                        который уже будет автоматически связан с документом по
                        которому мы отчитываемся
                      </Text>
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_3.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        В окне где предлагают скопировать реквизиты, вы можете
                        убрать галочки так же как на видео, чтобы не копировать
                        реквизиты с документа по которому отчитываемся и начать
                        заполнять наш отчет с чистого листа!
                      </Alert>
                      <Text>
                        В итоге у вас должен открыться чистый проект документа
                      </Text>
                    </>
                  )}

                  {active === 3 && (
                    <>
                      <Alert
                        variant="light"
                        color="yellow"
                        title="Предупреждение"
                        icon={<IconAlertCircle />}
                      >
                        Перед началом заполнения проекта отчета, обязательно,
                        перейдите в раздел <b>Связки</b> и удостоверьтесь что
                        связка с основным нашим документом по которому
                        отчитываетесь присутствует! Иначе адресат:{" "}
                        <b>Минздрав</b> не увидит ваш отчет!
                      </Alert>
                      <Text>
                        В чистом окне нашего документа т.е отчета, добавляем
                        предварительно подготовленный{" "}
                        <b>Электронный бланк ССМП ЕСЭД по ГОСТУ</b> с содержимым
                        нашего отчета и готовыми закладки ЕСЭД (для того чтобы
                        система автоматически проставила данные в закладках
                        исходя из реквизитов проекта) и присваиваем ему{" "}
                        <b>Тип: Основной</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="red"
                        title="Важно"
                        icon={<IconAlertTriangle />}
                      >
                        Если не проставить <b>Тип: Основной</b> вашему
                        подготовленному бланку ЕСЭД с закладками. То после
                        регистрации система не проставит данные с реквизитов
                        проекта в ваш электронный бланк! В т.ч{" "}
                        <b>ЭЛЕКТРОННОЙ ПОДПИСИ РУКОВОДИТЕЛЯ НЕ БУДЕТ!</b>, что
                        будет являться нарушением.
                      </Alert>
                      <Text>
                        Обязательно заполняем реквизиты <b>Содержание</b> (тему
                        отчета), <b>Состав </b>(сколько документов вы прикрепили
                        к проекту)
                      </Text>{" "}
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_4.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Text>
                        В разделе <b>Визы и подписи</b> направляем на подпись
                        Ивановой А.А. точно так же как на видео (срок можете
                        проставить свой)!
                      </Text>
                      <Alert
                        variant="light"
                        color="red"
                        title="Важно"
                        icon={<IconAlertTriangle />}
                      >
                        При добавлении подписывающих, настоятельно рекомендуем
                        нажимать <b>Направить на подпись</b> вместо{" "}
                        <b>Добавить</b>
                      </Alert>
                      <Text>
                        В конце не забываем указать <b>Адресата</b> и жмем{" "}
                        <b>Регистрировать</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="yellow"
                        title="Предупреждение"
                        icon={<IconAlertCircle />}
                      >
                        В адресатах{" "}
                        <b>ВЫБИРАЙТЕ ОФИЦИАЛЬНЫЙ ЯЩИК ОРГАНИЗАЦИИ</b> куда
                        направляете, например <b>Минздрав - официальный ящик</b>{" "}
                        а НЕ конкретного человека.
                      </Alert>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Если возникли трудности вы всегда можете обратиться к
                        оператору системы ЕСЭД - тел. 39-80-00
                      </Alert>
                      <Text>
                        В итоге ваш проект должен принять статус{" "}
                        <b>На подписи</b>... - таким образом, Вы направили свой
                        отчет руководителю на подписание
                      </Text>
                    </>
                  )}

                  {active === 4 && (
                    <>
                      <Text>
                        Для того, чтобы следить за своими документами
                        (проектами) необходимо перейти на главную страницу
                        системы ЕСЭД в раздел <b>Мои проекты документов</b>
                      </Text>

                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_5.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>

                      <Text>
                        Внутри раздела, обратите внимание на колонку{" "}
                        <b>Состояние</b> - она подскажет Вам подписали ваш
                        документ или нет...
                      </Text>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Состояние документа (статус) так же отображается внутри
                        самого проекта документа зеленым цветом
                      </Alert>
                    </>
                  )}

                  {active === 5 && (
                    <>
                      <Text>
                        После того как Ваш отчет подпишет руководитель и
                        состояние вашего проекта станет <b>Подписан</b> Вам
                        необходимо перейти в проект своего документа и нажать{" "}
                        <b>Направить на регистрацию</b> - таким образом, Вы
                        направляете ваш отчет секретарю для присвоения
                        исходящего номера
                      </Text>
                      <Text>
                        Как только вы нажмете, статус вашего проекта должен
                        стать <b>На регистрации</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Вы можете позвонить в Приемную (см. телефонный номер в
                        разделе{" "}
                        <Anchor component={Link} to="/tel" fw={500}>
                          Телефоны
                        </Anchor>
                        ). и попросить зарегистрировать сразу, но секретарю
                        придется искать ваш Проект в соответствующем разделе,
                        что не очень удобно для секретаря.
                      </Alert>

                      <Text>На этом с вашей стороны всё!</Text>
                      <Text>
                        Дальше уже секретарь должен зарегистрировать ваш
                        исходящий документ.
                      </Text>
                    </>
                  )}

                  {/* Сюда можно спокойно кидать кнопки, формы и всё что угодно */}
                </Stack>
              </Flex>
            </Paper>
          </>
        )}
        {esedType === "novoe" && (
          <>
            <Paper shadow="md" withBorder p="xl">
              {/* Используем Flex вместо Group, выравниваем по верхнему краю */}
              <Flex gap="xl" align="flex-start" wrap="nowrap">
                {/* Левая колонка: Степпер с фиксированной шириной */}
                <Stepper
                  w={250} // Самый удобный способ задать ширину в Mantine (250px)
                  active={active}
                  onStepClick={setActive}
                  orientation="vertical"
                >
                  <Stepper.Step
                    label="Шаг 1"
                    description="Регистрируем проект"
                  />
                  <Stepper.Step label="Шаг 2" description="Заполняем проект" />
                  <Stepper.Step
                    label="Шаг 3"
                    description="Следим за статусом"
                  />
                  <Stepper.Step label="Шаг 4" description="Финал" />
                </Stepper>
                {/* Правая колонка: Динамический контент, который займет всё оставшееся место */}
                <Stack style={{ flex: 1 }}>
                  {active === 0 && (
                    <>
                      <Text>
                        {" "}
                        Чтобы отправить новый документ, необходимо на главной
                        странице ЕСЭД нажать <b>Регистрация</b>, затем{" "}
                        <b>Регистрировать проект документа</b>
                      </Text>
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_1_novoe.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Text>
                        {" "}
                        Выбираем тип документа <b>Исходящий</b> и в итоге у вас
                        должен открыться чистый проект документа...
                      </Text>
                    </>
                  )}
                  {active === 1 && (
                    <>
                      <Text>
                        Приступаем к заполнению чистого проекта документа:
                      </Text>
                      <Text>
                        Добавляем предварительно подготовленный{" "}
                        <b>Бланк ЕСЭД ССМП ПО ГОСТУ</b> и присваиваем{" "}
                        <b>Тип: Основной</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="red"
                        title="Важно"
                        icon={<IconAlertTriangle />}
                      >
                        Если не проставить <b>Тип: Основной</b> вашему
                        подготовленному бланку ЕСЭД с закладками. То после
                        регистрации система не проставит данные с реквизитов
                        проекта в ваш электронный бланк! В т.ч{" "}
                        <b>ЭЛЕКТРОННОЙ ПОДПИСИ РУКОВОДИТЕЛЯ НЕ БУДЕТ!</b>, что
                        будет являться нарушением.
                      </Alert>
                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_2_novoe.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>
                      <Text>
                        Обязательно заполняем реквизиты <b>Содержание</b>{" "}
                        (тему), <b>Состав </b>(сколько документов вы прикрепили
                        к проекту)
                      </Text>{" "}
                      <Text>
                        В разделе <b>Визы и подписи</b> направляем на подпись
                        Ивановой А.А. точно так же как на видео (срок можете
                        проставить свой)!
                      </Text>
                      <Alert
                        variant="light"
                        color="red"
                        title="Важно"
                        icon={<IconAlertTriangle />}
                      >
                        При добавлении подписывающих, настоятельно рекомендуем
                        нажимать <b>Направить на подпись</b> вместо{" "}
                        <b>Добавить</b>
                      </Alert>
                      <Text>
                        В конце не забываем указать <b>Адресата</b> и жмем{" "}
                        <b>Регистрировать</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="yellow"
                        title="Предупреждение"
                        icon={<IconAlertCircle />}
                      >
                        В адресатах{" "}
                        <b>ВЫБИРАЙТЕ ОФИЦИАЛЬНЫЙ ЯЩИК ОРГАНИЗАЦИИ</b> куда
                        направляете, например <b>Минздрав - официальный ящик</b>{" "}
                        а НЕ конкретного человека.
                      </Alert>
                      <Text>
                        В итоге ваш проект должен принять статус{" "}
                        <b>На подписи</b>... - таким образом, Вы направили свой
                        документ руководителю на подписание
                      </Text>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Если возникли трудности вы всегда можете обратиться к
                        оператору системы ЕСЭД - тел. 39-80-00
                      </Alert>
                    </>
                  )}
                  {active === 2 && (
                    <>
                      <Text>
                        Для того, чтобы следить за своими документами
                        (проектами) необходимо перейти на главную страницу
                        системы ЕСЭД в раздел <b>Мои проекты документов</b>
                      </Text>

                      <AspectRatio ratio={16 / 9} maw={800} mx="auto">
                        <video
                          src={`${API_BASE_URL}/uploads/esed/step_5.mp4`}
                          controls // Показывает стандартные кнопки управления (play, pause, громкость)
                          style={{ borderRadius: "var(--mantine-radius-md)" }} // Закругляем углы в стиле Mantine
                        />
                      </AspectRatio>

                      <Text>
                        Внутри раздела, обратите внимание на колонку{" "}
                        <b>Состояние</b> - она подскажет Вам подписали ваш
                        документ или нет...
                      </Text>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Состояние документа (статус) так же отображается внутри
                        самого проекта документа зеленым цветом
                      </Alert>
                    </>
                  )}

                  {active === 3 && (
                    <>
                      {" "}
                      <Text>
                        После того как Ваш отчет подпишет руководитель и
                        состояние вашего проекта станет <b>Подписан</b> Вам
                        необходимо перейти в проект своего документа и нажать{" "}
                        <b>Направить на регистрацию</b> - таким образом, Вы
                        направляете ваш документ секретарю для присвоения
                        исходящего номера
                      </Text>
                      <Text>
                        Как только вы нажмете, статус вашего проекта должен
                        стать <b>На регистрации</b>
                      </Text>
                      <Alert
                        variant="light"
                        color="teal"
                        title="Подсказка"
                        icon={<IconCanary />}
                      >
                        Вы можете позвонить в Приемную (см. телефонный номер в
                        разделе{" "}
                        <Anchor component={Link} to="/tel" fw={500}>
                          Телефоны
                        </Anchor>
                        ). и попросить зарегистрировать сразу, но секретарю
                        придется искать ваш Проект в соответствующем разделе,
                        что не очень удобно для секретаря.
                      </Alert>
                      <Text>На этом с вашей стороны всё!</Text>
                      <Text>
                        Дальше уже секретарь должен зарегистрировать ваш
                        исходящий документ.
                      </Text>
                    </>
                  )}

                  {/* Сюда можно спокойно кидать кнопки, формы и всё что угодно */}
                </Stack>
              </Flex>
            </Paper>
          </>
        )}
      </Stack>
    </>
  );
}
