import { shallowMount, mount, Wrapper } from "@vue/test-utils";
import RadioButton from "@/components/RadioButton.vue";

const commonsOptionsCreator = (defaultChoosen = "radio-1") => ({
  data() {
    return {
      choosen: defaultChoosen,
    };
  },
  components: {
    RadioButton,
  },
});

// The component to test
const ContainerHelperCreator = (defaultChoosen = "radio-1") => ({
  template: `
    <div>
      <RadioButton name="radio-group" value="radio-1" v-model="choosen" />
      <RadioButton name="radio-group" value="radio-2" v-model="choosen" />
    </div>
  `,
  ...commonsOptionsCreator(defaultChoosen),
});

const ContainerHelperWithSlotCreator = (defaultChoosen = "radio-1") => ({
  template: `
    <div>
      <radio-button name="radio-group" value="radio-1" v-model="choosen" label="Simple Label" />
      <radio-button name="radio-button-group" value="radio-2" v-model="choosen">
        <template slot:default slot-scope="{ isCurrentChecked }">
          <div>
            <h3>with sub components</h3>
            <input
              type="text"
              :disabled="!isCurrentChecked"
              :placeholder="isCurrentChecked ? 'Is Choosen' : 'Disabled'"
            />
          </div>
        </template>
      </radio-button>
    </div>
  `,
  ...commonsOptionsCreator(defaultChoosen),
});

const getLabelContainer = (wrapper: Wrapper<Vue>) => {
  const labeledRadioButtonContainer =
    wrapper.element.parentElement?.parentElement;
  const labelContentWrapper = labeledRadioButtonContainer?.querySelector(
    ".RadioButton-content"
  );
  return labelContentWrapper;
};

const createSelectorByValue = (value: string) =>
  `[data-testid="RadioButton-check"][data-value="${value}"]`;

describe("RadioButton.vue", () => {
  it("renders props.label correctly", () => {
    const label = "Simple Label";
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
    const wrapper = mount(ContainerHelperCreator(defaultChecked));
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
    const wrapper = mount(ContainerHelperCreator("radio-1"));
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
    const wrapper = mount(ContainerHelperCreator(defaultChecked));
    let radioCheck = wrapper.find(createSelectorByValue(defaultChecked));
    expect(radioCheck.find("input:checked").exists()).toBe(true);

    // check via click
    radioCheck = wrapper.find(createSelectorByValue("radio-1"));
    await radioCheck.trigger("click");
    expect(radioCheck.find("input:checked").exists()).toBe(true);

    const otherRadioCheck = wrapper.find(createSelectorByValue("radio-2"));
    expect(otherRadioCheck.find("input:checked").exists()).toBe(false);
  });

  describe("With slot", () => {
    it("hide props.label if there's a slot", () => {
      let wrapper = mount(ContainerHelperWithSlotCreator());
      const labeledRadioButton = wrapper.find(createSelectorByValue("radio-1"));
      const radioButtonWithSlot = wrapper.find(
        createSelectorByValue("radio-2")
      );

      expect(getLabelContainer(labeledRadioButton)?.textContent).toMatch(
        /simple label/gi
      );
      expect(
        getLabelContainer(labeledRadioButton)?.querySelectorAll(
          ".RadioButton-label"
        ).length
      ).toBe(1);

      expect(getLabelContainer(radioButtonWithSlot)?.textContent).toMatch(
        /with sub components/gi
      );
      expect(
        getLabelContainer(radioButtonWithSlot)?.querySelectorAll(
          ".RadioButton-label"
        ).length
      ).toBe(0);
    });

    it("passing scoped slot data correctly", () => {
      let wrapper = mount(ContainerHelperWithSlotCreator("radio-1"));
      let radioButtonWithSlot = wrapper.find(createSelectorByValue("radio-2"));
      expect(
        getLabelContainer(radioButtonWithSlot)?.querySelectorAll(
          "input:disabled"
        ).length
      ).toBe(1);

      wrapper = mount(ContainerHelperWithSlotCreator("radio-2"));
      radioButtonWithSlot = wrapper.find(createSelectorByValue("radio-2"));
      expect(
        getLabelContainer(radioButtonWithSlot)?.querySelectorAll(
          "input:disabled"
        ).length
      ).toBe(0);
    });
  });
});
