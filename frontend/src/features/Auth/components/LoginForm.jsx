import React from "react";
import useAuth from "../useAuth";
import { Form, Button, Space, Card } from "antd";
import { InputPassword } from "@/components/Atom/InputPassword";
import { Input } from "@/components/Atom/Input";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function LoginForm({ loading }) {
  const { logInUser } = useAuth();
  const { t } = useTranslation();
  const onFinish = (values) => {
    logInUser(values);
  };
  return (
    <Card className="login-card">
      <Space className="login-inner-container" direction="vertical">
        <div className="login-logo-container">
          <img src="/logo.png" alt="CMS Magic Wheel" className="" />
          <p>{t("common.reconciliation")}</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          disabled={loading}
          className="form-login"
        >
          <Input
            label={t("common.username")}
            name="username"
            placeholder={t("common.username")}
            required
          />
          <InputPassword
            label={t("common.password")}
            name="password"
            placeholder={t("common.password")}
            required
          />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              iconPosition="end"
              className="login-button"
              loading={loading}
            >
              {loading ? t("common.logging") : t("common.login")}
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <LanguageSwitcher showLabel />
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
}

export default LoginForm;
