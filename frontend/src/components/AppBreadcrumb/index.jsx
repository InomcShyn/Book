import { Breadcrumb } from "antd";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPathUrl } from "@/utils";
import "./index.scss";
import { HomeOutlined } from "@ant-design/icons";
import PATH from "@/configs/paths/PATH";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import getMenuItems from "../AppSider/hooks/menuItems";
import { useTranslation } from "react-i18next";
import { findByKeyInChildren } from "@/utils/form/common";
import { ROLE_ACCOUNT } from "@/constants/constants";

const AppBreadcrumb = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pathUrl = getPathUrl(pathname);
  const isMobile = useMediaQuery(`(max-width: ${mediaQueryPoints.md}px)`);
  const isMobileXs = useMediaQuery(`(max-width: ${mediaQueryPoints.xs}px)`);
  const { t } = useTranslation();
  const items = useMemo(() => getMenuItems(t, ROLE_ACCOUNT.ADMIN), [t]);

  const onNavigate = (e, href, isClickable) => {
    e.preventDefault();
    if (!isClickable) return;
    navigate(href);
  };

  const flattenPath = (obj) => {
    const paths = [];
    const traverse = (value) => {
      if (typeof value === "string") {
        paths.push(value);
      } else if (typeof value === "object") {
        Object.values(value).forEach(traverse);
      }
    };
    traverse(obj);
    return paths;
  };

  const validPaths = flattenPath(PATH);

  const buildItem = (key, name, href, isLast, isDynamic) => {
    const urlName = name.replace(/-/g, "_");
    const result = findByKeyInChildren(items, urlName);
    let formattedName = result?.label;
    if (!result) {
      if (name == "add") formattedName = t("form.add");
      else if (name == "edit") formattedName = t("form.edit");
    }
    const isClickable = !isLast && !isDynamic && validPaths.includes(href);
    const label = (
      <span
        className={classNames("breadcrumb-label", { clickable: isClickable })}
        onClick={(e) => isClickable && onNavigate(e, href, isClickable)}
        style={isClickable ? { cursor: "pointer" } : {}}
      >
        {key === 0 && (
          <HomeOutlined
            style={{
              marginRight: 14,
              fontSize: isMobileXs ? 14 : isMobile ? 16 : 25,
            }}
          />
        )}
        {formattedName}
      </span>
    );

    return {
      key,
      title: label,
      className: classNames(
        isClickable ? "breadcrumb-clickable" : "breadcrumb-not-clickable",
        isLast && "breadcrumb-last"
      ),
    };
  };

  const trimmedPathUrl = [...pathUrl];
  if (
    trimmedPathUrl.length > 0 &&
    trimmedPathUrl[trimmedPathUrl.length - 1].isDynamicSegment === true
  ) {
    trimmedPathUrl.pop();
  }

  const breadcrumbItems = [
    buildItem(0, "home", "/", trimmedPathUrl.length === 0, false),
    ...trimmedPathUrl.map((item, index) =>
      buildItem(
        index + 1,
        item.name,
        item.url,
        index === trimmedPathUrl.length - 1,
        item.isDynamicSegment
      )
    ),
  ];

  return <Breadcrumb className="app-breadcrumb" items={breadcrumbItems} />;
};

export default AppBreadcrumb;
