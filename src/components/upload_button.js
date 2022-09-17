import React, { useState, useEffect } from "react";

const UploadButton = () => {
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [newImg, setNewImg] = useState();
  const [data, setData] = useState({});

  function handleFileChange(e) {
    console.log(e.target.file);
    setFile([...e.target.files]);
  }
  async function handleFileUpload() {
    let formData = new FormData();
    formData.append("Image", file);

    await fetch("http://3.134.98.180:8100/api/detect?engine=test_image", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response);

        return response.formData();
      })

      .then((formData) => {
        for (let [key, data] of formData) {
          if (key === "labels") {
            let responseData = JSON.parse(data);

            console.log(responseData);
            setData({ ...responseData });
          }
          if (key === "image") {
            console.log(data);
            return data.arrayBuffer();
          }
        }
      })
      .then((res) => {
        console.log(new Uint8Array(res));
        const imageString = btoa(String.fromCharCode(...new Uint8Array(res)));

        setNewImg(imageString);
      })

      .catch((error) => {
        console.log("Error :---", error);
      });
  }

  console.log(data[0]);

  useEffect(() => {
    setImage(window.URL.createObjectURL(new Blob(file, { type: "image/*" })));
  }, [file, newImg]);
  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ margin: "16px", padding: "10px" }}
      />
      <div style={{ margin: "16px", padding: "10px" }}>
        <button onClick={handleFileUpload}>Upload Picture</button>
      </div>

      <div>
        {file.length !== 0 ? (
          <img src={image} alt="new" height="200px" width="200px" />
        ) : (
          <></>
        )}
      </div>

      <div
        style={{
          position: "relative",
          top: `${data[0]?.["top"]}`,
          bottom: `${data[0]?.["bottom"]}`,
          left: `${data[0]?.["left"]}`,
          right: `${data[0]?.["right"]}`,
        }}
      >
        {data[0] ? (
          <div>
            <h1>{data[0]?.["label_type_name"]}</h1>

            <img
              src={`data:image/png;base64,${newImg}`}
              alt="Response_Image"
              height="300px"
              width="300px"
              style={{ border: "1px solid black" }}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default UploadButton;
