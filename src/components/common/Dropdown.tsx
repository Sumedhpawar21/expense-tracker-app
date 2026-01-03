import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownComponentProps {
  data: { label: string; value: string | null }[];
  onChange: (value: any) => void;
  label?: string; // optional floating label
  defaultLabel?: string;
  defaultValue?: string | null;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  onChange,
  label,
  defaultLabel = "Select an option",
  defaultValue = null,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    defaultValue
  );
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const renderLabel = () => {
    if ((selectedValue && label) || (isFocus && label)) {
      return (
        <Text style={[styles.label, isFocus && styles.labelFocus]}>
          {label}
        </Text>
      );
    }
    return null;
  };
  const clearValue = () => {
    setSelectedValue(null);
    onChange("");
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={
          !isFocus && !selectedValue
            ? defaultLabel
            : !selectedValue
            ? "..."
            : undefined
        }
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelectedValue(item.value);
          onChange(item.value as string);
          setIsFocus(false);
        }}
        renderRightIcon={() =>
          selectedValue ? (
            <Text style={styles.clearIcon} onPress={clearValue}>
              ✕
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: "100%",
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: "#fff",
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: "100%",
  },
  dropdownFocus: {
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
    marginLeft: 4,
  },
  labelFocus: {
    color: "#007AFF",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#555",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  clearIcon: {
    fontSize: 18,
    color: "#888",
    paddingHorizontal: 8,
  },
});
