import { Button, Checkbox, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useState } from "react";

import { client } from "../../libs/axios";

const Home: FC = () => {
  const [msg, setMsg] = useState<string>();
  const [btnDisable, setBtnDisable] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      termsOfService: false,
    },
  });

  return (
    <main className="flex justify-center flex-col mx-auto mt-10 w-11/12 md:w-1/2 h-full">
      <h1 style={{ fontFamily: "Cookie" }} className="text-center text-3xl lg:text-4xl font-bold">
        kosen.land Misskey Invitation
      </h1>
      <div className="text-center text-sm my-2">
        <p>
          これは、Misskeyインスタンス{" "}
          <a
            href={import.meta.env.VITE_INSTANCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600"
          >
            {import.meta.env.VITE_INSTANCE_URL.replace(/https?:\/\//, "").replace(/\//g, "")}
          </a>{" "}
          の招待発行ページです
        </p>
        <p>
          高専機構が発行したあなたのメールアドレス<span>(*@*.kosen-ac.jp)</span>
          を入力して下さい
        </p>
        <p>
          あなたの高専のメールアドレスがこの形式でない場合、
          <a
            href={import.meta.env.VITE_ADDRESS_REQUEST_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0000ee]"
          >
            こちら
          </a>
          に連絡して下さい
        </p>
      </div>
      <form
        onSubmit={form.onSubmit((values) => {
          client
            .post("/api/v1/request", {
              email: values.email,
            })
            .then((res) => {
              const { status, message }: { status: string; message: string } = res.data;
              if (status === "OK") {
                setMsg("メールを確認してください");
                setBtnDisable(true);
                form.setFieldValue("termsOfService", false);
                setTimeout(() => setBtnDisable(false), 10000);
              } else if (status === "NG") {
                if (message === "EXIST_EMAIL") setMsg("すでに登録されているメールアドレスです");
              } else setMsg("エラーが発生しました");
            })
            .catch((err) => {
              const { status, message }: { status: string; message: string } = err.response.data;
              if (status === "NG") {
                if (message === "EXIST_EMAIL") setMsg("すでに登録されているメールアドレスです");
                else if (message === "UNAUTHORIZED_DOMAIN") setMsg("認証ドメインのメールアドレスではないようです");
                else if (message === "BAD_FORMAT") setMsg("不適切なフォーマットです");
                else setMsg("エラーが発生しました");
              } else setMsg("エラーが発生しました");
            });
        })}
      >
        <TextInput
          type="email"
          label="メールアドレス"
          mt="sm"
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("email")}
        />
        <Checkbox
          label={
            <span>
              <a
                href={import.meta.env.VITE_TOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                利用規約
              </a>
              に同意する
            </span>
          }
          mt="sm"
          checked={form.values.termsOfService}
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("termsOfService")}
        />
        <Button type="submit" my="sm" className="bg-[#0072bf]" disabled={btnDisable}>
          メールを認証する
        </Button>
        {msg && <p className="my-2 text-red-600">{msg}</p>}
      </form>
      <p style={{ fontFamily: "Homemade Apple" }} className="text-center mt-4">
        Copyright &copy; 2022 kosen.land
      </p>
      <p className="text-center text-xs mt-6">
        このサイトは国立高等専門学校機構及び各高専が管理運営しているものではありません
      </p>
    </main>
  );
};

export { Home };
