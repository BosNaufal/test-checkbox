import { shallowMount, mount } from "@vue/test-utils";
import RadioButton from "@/components/RadioButton.vue";

// The component to test
const ContainerHelperCreator = (defaultChoosen = "radio-1") => ({
  template: `
    <div>
      <h1>{{ choosen }}</h1>
      <RadioButton name="radio-group" value="radio-1" v-model="choosen" />
      <RadioButton name="radio-group" value="radio-2" v-model="choosen" />
    </div>
  `,
  data() {
    return {
      choosen: defaultChoosen,
    };
  },
  components: {
    RadioButton,
  },
});

const createSelectorByValue = (value: string) =>
  `[data-testid="RadioButton-check"][data-value="${value}"]`;

describe("RadioButton.vue", () => {
  it("renders props.label correctly", () => {
    let label = "Simple Label";
    let wrapper = shallowMount(RadioButton, {
      propsData: {
        label,
      },
    });
    expect(wrapper.text()).toMatch(label);

    wrapper = shallowMount(RadioButton, {
      propsData: {},
    });
    expect(wrapper.text()).toMatch("");
  });

  it("checked correctly", async () => {
    // default checked
    const defaultChecked = "radio-2";
    let wrapper = mount(ContainerHelperCreator(defaultChecked));
    let radioCheck = wrapper.find(createSelectorByValue(defaultChecked));
    expect(radioCheck.attributes("data-checked")).toBe("true");

    // check via click
    radioCheck = wrapper.find(createSelectorByValue("radio-1"));
    const radioCheckClickedTarget = wrapper.find(
      createSelectorByValue("radio-2")
    );
    await radioCheckClickedTarget.trigger("click");
    expect(radioCheckClickedTarget.attributes("data-checked")).toBe("true");
    expect(radioCheck.attributes("data-checked")).toBe("false");
  });

  it("emit v-model value correctly", async () => {
    // default checked
    let wrapper = mount(ContainerHelperCreator("radio-1"));
    expect((wrapper.vm as any).choosen).toBe("radio-1");

    // check via click
    const radioCheckClickedTarget = wrapper.find(
      createSelectorByValue("radio-2")
    );
    await radioCheckClickedTarget.trigger("click");
    expect((wrapper.vm as any).choosen).toBe("radio-2");
  });

  it("fallback input checked correctly", async () => {
    // default checked
    const defaultChecked = "radio-2";
    let wrapper = mount(ContainerHelperCreator(defaultChecked));
    let radioCheck = wrapper.find(createSelectorByValue(defaultChecked));
    expect(radioCheck.find("input:checked").exists()).toBe(true);

    // check via click
    radioCheck = wrapper.find(createSelectorByValue("radio-1"));
    await radioCheck.trigger("click");
    expect(radioCheck.find("input:checked").exists()).toBe(true);

    const otherRadioCheck = wrapper.find(createSelectorByValue("radio-2"));
    expect(otherRadioCheck.find("input:checked").exists()).toBe(false);
  });
});
