import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Label, LabelUppercase } from "../components/styles";
import { useTranslation } from "react-i18next";
import getMenuItems from "./menuItems";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";

export default function useSider() {
  const location = useLocation();
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([""]);
  const { t } = useTranslation();
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;

  const handleMenuClick = (data) => {
    if (defaultOpenKeys.includes(data.key)) {
      setDefaultOpenKeys(defaultOpenKeys.filter((key) => key !== data.key));
    } else {
      setDefaultOpenKeys([...defaultOpenKeys, data.key]);
    }
  };
  const items = useMemo(() => getMenuItems(t, roleUser), [t, roleUser]);

  const findActiveMenuKeys = (path, items) => {
    const searchInItems = (itemsList, openKeys = []) => {
      for (const item of itemsList) {
        if (item.path === path) {
          return { selected: item.key, openKeys };
        }

        if (item.children) {
          const result = searchInItems(item.children, [...openKeys, item.key]);
          if (result.selected) {
            return result;
          }
        }
      }

      for (const item of itemsList) {
        if (
          item.path &&
          item.path !== path &&
          path.startsWith(item.path + "/")
        ) {
          return { selected: item.key, openKeys: [] };
        }
      }

      return { selected: "", openKeys: [] };
    };

    return searchInItems(items);
  };

  const selectedKey = useMemo(() => {
    const currentPath = location.pathname;
    const { selected } = findActiveMenuKeys(currentPath, items);

    let tabDefaultActive = "";

    items.forEach((item = {}) => {
      const { children } = item;
      children?.forEach((childItem = {}) => {
        const childItem2 = childItem.children || null;
        if (childItem2) {
          childItem2.forEach((childItem2 = {}) => {
            if (childItem2.path === location.pathname) {
              tabDefaultActive = childItem.key;
            }
          });
        }
      });
      defaultOpenKeys;
    });
    return [selected];
  }, [location.pathname, items]);

  useEffect(() => {
    const currentPath = location.pathname;
    const { openKeys } = findActiveMenuKeys(currentPath, items);
    setDefaultOpenKeys(openKeys);
  }, [location.pathname, items]);

  const transformMenuItems = (items) => {
    return items.map((item) => ({
      ...item,
      label: item.path ? (
        <NavLink
          to={item.path}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          <span className="label">{item.label}</span>
        </NavLink>
      ) : item.type === "group" ? (
        <LabelUppercase>{item.label}</LabelUppercase>
      ) : (
        <div onClick={() => handleMenuClick(item)}>
          <Label>{item.label}</Label>
        </div>
      ),
      children: item.children ? transformMenuItems(item.children) : undefined,
    }));
  };

  const menuItems = useMemo(
    () => transformMenuItems(items),
    [items, defaultOpenKeys]
  );

  return {
    selectedKey,
    menuItems,
    defaultOpenKeys,
  };
}
