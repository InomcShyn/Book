import { Descriptions as AntDescriptions, Form, Typography } from "antd";
import "./index.scss";

export const DescriptionsField = ({
  items = [],
  form,
  values = {},
  column = 1,
  ...props
}) => {
  return (
    <Form form={form} component={false}>
      <Form.Item noStyle shouldUpdate>
        {() => (
          <AntDescriptions
            column={column}
            className="gt-description"
            size="small"
            bordered
            items={items.map(({ children, name, ...rest }) => {
              const value = name ? form.getFieldValue(name) : children;
              return {
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {value ?? "-"}
                  </Typography.Paragraph>
                ),
                ...rest,
              };
            })}
            {...props}
          />
        )}
      </Form.Item>
    </Form>
  );
};
