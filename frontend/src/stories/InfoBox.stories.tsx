import type { Meta, StoryObj } from "@storybook/react";
import { InfoBox } from "../components/atoms/infos/InfoBox";

const meta: Meta<typeof InfoBox> = {
    title: "Components/InfoBox",
    component: InfoBox,
    argTypes: {
        context: { control: "text" },
    },
};

export default meta;

type Story = StoryObj<typeof InfoBox>;

export const Default: Story = {
    args: {
        context: "이곳에 유용한 정보를 제공합니다!",
    },
};

export const Warning: Story = {
    args: {
        context: "중요: 변경 사항을 저장하세요.",
    },
};

export const Success: Story = {
    args: {
        context: "성공적으로 완료되었습니다!",
    },
};
