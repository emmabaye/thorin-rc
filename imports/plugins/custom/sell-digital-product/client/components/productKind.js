import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Products } from "/lib/collections";
import axios from "axios";
import { DigitalProducts } from "../../lib/collections";
import { ReactionProduct } from "/lib/api";
import { registerComponent } from "@reactioncommerce/reaction-components";

class ProductKind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productKind: "physical",
      uploading: false,
      uploadSuccess: false,
      uploadError: false
    };
  }

  componentDidUpdate() {
    if (this.refs.fileUrl && localStorage.getItem(window.location.pathname) !== null) {
      this.refs.fileUrl.value = localStorage.getItem(window.location.pathname);
    }
  }

  /**
   *  Handler for changes in input
   *
   * @param  {object} e event object
   * @return {undefined}
   */
  handleChange = () => {
    window.ReactionProduct = ReactionProduct;
    const kind  = this.refs.productKind.options[
      this.refs.productKind.selectedIndex
    ].value;

    const modifier = {
      uploadSuccess: false,
      productId: ReactionProduct.selectedProductId(),
      isDigital: true
    };
    if (kind === "digital") {
      modifier.isDigital = true;

      this.setState({
        ...this.state,
        productKind: "digital"
      });
      window.productKind = "digital";
    }
    if (kind === "physical") {
      modifier.isDigital = false;

      this.setState({
        ...this.state,
        productKind: "physical"
      });
      window.productKind = "physical";
    }

    Meteor.call("upsertDigitalProduct", modifier,
      function (err, result) {
        if (err) {
          console.log("ERROR ", err);
        } else {
          console.log("RESULT ", result);
        }
      });
  }

  handleUpload = (evt) => {
    evt.preventDefault();
    const formData = new FormData();
    formData.append("file", this.refs.file.files[0]);
    formData.append("upload_preset", "thorin-rc");
    return axios({
      method: "post",
      url: "https://api.cloudinary.com/v1_1/emmabaye/upload",
      data: formData,
      withCredentials: false,
      onUploadProgress: function (progressEvent) {
        console.log("UPLOADING FILE");
        this.setState({
          ...this.state,
          uploading: true,
          uploadSuccess: false,
          uploadError: false
        });

        const progress = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        console.log("PROGRESS ", progress);
        this.refs.fileUrl.value = `${progress}%`;
      }.bind(this)
    })
      .then((response) => {
        console.log("UPLOAD SUCCESS ", response);
        this.setState({
          ...this.state,
          uploadSuccess: true,
          uploading: false,
          uploadError: false
        });
        this.refs.fileUrl.value = `${response.data.secure_url}`;
        localStorage.setItem(window.location.pathname, response.data.secure_url);

        let modifier = {
          uploadSuccess: true,
          productId: ReactionProduct.selectedProductId,
          productTitle: ReactionProduct.selectedProduct().title,
          isDigital: true,
          fileUrl: response.data.secure_url,
          bytes: response.data.bytes

        }

        Meteor.call("upsertDigitalProduct", modifier,
          function (err, result) {
            if (err) {
              console.log("ERROR ", err);
            } else {
              console.log("RESULT ", result);
            }
          });
      })
      .catch((err) => {
        console.log("UPLOAD FAILED ", err);
        this.setState({
          ...this.state,
          uploadSuccess: false,
          uploading: false,
          uploadError: true
        });
        this.refs.fileUrl.value = "";
      });
  }

  render() {
    return (
      <div>
        <select style={{ width: "50%", padding: "0px !important",
          marginBottom: "10px", height: "35px",
          position: "relative", left: "-3px" }} ref="productKind"
          onChange={this.handleChange} //eslint-disable-line
        >
          <option key="1" value="physical" >Physical Product</option>
          <option key="2" value="digital">Digital Product</option>
        </select>
        { this.state.productKind === "digital" &&
        <div>
          <form style={{ display: "flex", flexDirection: "row" }}>
            <input
              ref="file"
              type="file"
              style={{ width: "50%", marginBottom: "10px", height: "30px", position: "relative", left: "0px" }}
              className="form-control-file"
            />
            <button value="upload" onClick={this.handleUpload} type="submit" style={{ height: "30px", marginLeft: "10px", color: "white", backgroundColor: "#228cfe", border: "1px", borderColor: "grey" }}>
              { this.state.uploading && <i className="fa fa-spinner fa-spin" /> }
              &nbsp;Upload
            </button>
          </form>
          { this.state.uploadSucess && <label style={{ color: "green" }}>Success!</label> }
          { this.state.uploadError && <label style={{ color: "red" }}>Error Uploading</label> }
          <input
            ref="fileUrl"
            placeholder="File URL"
            style={{ width: "100%", marginBottom: "10px", height: "30px", position: "relative", left: "0px" }}
            type="text"
          />
        </div>
        }
      </div>
    );
  }
}

registerComponent("ProductKind", ProductKind);

export default ProductKind;

