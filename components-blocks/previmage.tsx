// import {
//   NotEditable,
//   component,
//   fields,
// } from "@keystone-6/fields-document/component-blocks";

// export const previmageComponentBlock = component({
//   component: (props) => {
//     //hacky way to get the gql query for the cloudinary image data
//     const data = props.image.value.map((data) => data.data);
//     console.log(props);
//     if (!props.image) return <NotEditable>No image selected</NotEditable>;

//     return (
//       <NotEditable>
//         <h2>Image will be here</h2>
//         {data.map((img: any, idx) => {
//           return (
//             <img
//               style={{ width: "100%" }}
//               key={idx}
//               className="body-image"
//               src={img?.image?.publicUrlTransformed}
//               alt={img?.image?.altText}
//             />
//           );
//         })}
//       </NotEditable>
//     );
//   },
//   label: "Image",
//   // these are props that will be passed to component
//   props: {
//     image: fields.relationship<"many">({
//       label: "Choose the image",
//       relationship: "photo",
//     }),
//     // imagetest: fields.relationship<"many">({
//     //   label: "Test Image",
//     //   relationship: "postimage",
//     // }),
//   },
// });
