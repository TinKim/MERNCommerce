import React, { useEffect, useState } from "react";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import * as ProductService from "../../services/ProductService";
import { Checkbox, Rate } from "antd";
import TypeProduct from "../TypeProduct/TypeProduct";

const NavbarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  //   const onChange = () => {};
  //   const renderContent = (type, options) => {
  //     switch (type) {
  //       case "text":
  //         return options.map((option, index) => {
  //           return <WrapperTextValue key={index}>{option}</WrapperTextValue>;
  //         });
  //       case "checkbox":
  //         return (
  //           <Checkbox.Group
  //             style={{
  //               width: "100%",
  //               display: "flex",
  //               flexDirection: "column",
  //               gap: "12px",
  //             }}
  //             onChange={onChange}
  //           >
  //             {options.map((option, index) => {
  //               return (
  //                 <Checkbox
  //                   key={index}
  //                   style={{ marginLeft: 0 }}
  //                   value={option.value}
  //                 >
  //                   {option.label}
  //                 </Checkbox>
  //               );
  //             })}
  //           </Checkbox.Group>
  //         );
  //       case "star":
  //         return options.map((option, index) => {
  //           return (
  //             <div key={index} style={{ display: "flex", gap: "4px" }}>
  //               <Rate
  //                 style={{ fontSize: "12px" }}
  //                 disabled
  //                 defaultValue={option}
  //               />
  //               <span>{`từ ${option} sao`}</span>
  //             </div>
  //           );
  //         });
  //       case "price":
  //         return options.map((option, index) => {
  //           return <WrapperTextPrice key={index}>{option}</WrapperTextPrice>;
  //         });
  //       default:
  //         return {};
  //     }
  //   };

  return (
    <div>
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>
        {typeProducts.length > 0 && (
          <>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </>
        )}
      </WrapperContent>
      {/* <WrapperContent>
                {renderContent('checkbox', [
                        { value: 'a', label: 'A' },
                        { value: 'b', label: 'B' },
                    ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [3, 4, 5])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['dưới 40', 'trên 50.000'])}
            </WrapperContent> */}
    </div>
  );
};

export default NavbarComponent;
