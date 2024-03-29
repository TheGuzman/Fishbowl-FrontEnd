import AddIcon from "@mui/icons-material/Add";
import { Box, Stack, Typography } from "@mui/material";
import Fab from "@mui/material/Fab";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import background from "../../assets/imgs/fishes.jpeg";
import FishbowlNav from "../../components/breadCrumb-nav/bread-crumb-myfishbowls";
import CircularColor from "../../components/circular-progress/circular-progress";
import FishbowlCard from "../../components/fishbowl-card/fishbowl-card";
import ProfileAvatar from "../../components/profile-avatar/profile-avatar";

export default function MyFishbowlsPage() {
  const url = process.env.REACT_APP_URL;

  const [allFishbowls, setAllFishbowls] = useState([]);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);

  const [t] = useTranslation("global");

  useEffect(() => {
    fetch(`${url}/user/becomeafish/myfishbowls/getuserfishbowls`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("sesion"),
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setAllFishbowls(d);
        setLoading(false);
      });
  }, [change]);

  const onDeleteFishbowl = (fishbowlId) => {
    //custom hook for deleting the fishbowl

    setLoading(true);

    fetch(`${url}/user/becomeafish/deleteafishbowl/${fishbowlId}`, {
      method: "DELETE",
      headers: {
        Authorization: sessionStorage.getItem("sesion"),
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setChange(!change);
      });
  };

  const onStartFishbowl = (fishbowlId) => {
    //custom hook for starting the fishbowl

    fetch(`${url}/user/becomeafish/startafishbowl/${fishbowlId}`, {
      method: "PATCH",
      headers: {
        Authorization: sessionStorage.getItem("sesion"),
      },
    }).then((r) => r.json());
  };

  return (
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ margin: "0em 1em" }} variant="h5">
          {t("myFishbowlsPage.tittle")}
        </Typography>
        <ProfileAvatar></ProfileAvatar>
      </Stack>
      <Stack alignItems={"center"} margin={"0.5em 0em"}>
        <FishbowlNav></FishbowlNav>
      </Stack>

      {loading !== true ? (
        <Stack>
          <Stack direction="row" alignItems={"center"} justifyContent={"center"} sx={{ margin: "1em 0em" }}>
            <Typography sx={{ margin: "0em 1em" }} variant="h6">
              {t("myFishbowlsPage.addAfishbowl")}
            </Typography>
            <Fab
              color="secondary"
              size="small"
              aria-label="add"
              component={Link}
              to="/becomeafish/myfishbowls/createfishbowl"
            >
              <AddIcon />
            </Fab>
          </Stack>

          <Box sx={{ backgroundImage: `url(${background})`, backgroundSize: "cover", minHeight: 370 }}>
            <Stack direction="row" sx={{ flexWrap: "wrap", margin: "0.5em", gap: "0.5em", justifyContent: "center" }}>
              {allFishbowls?.map((e, i) => (
                <FishbowlCard
                  onDeleteFishbowl={onDeleteFishbowl}
                  onStartFishbowl={onStartFishbowl}
                  fishbowlCreator={false}
                  deleteButton={true}
                  info={e}
                  key={i}
                ></FishbowlCard>
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Stack alignItems={"center"}>
          <Typography sx={{ margin: "0em 1em" }} variant="h6">
            {t("myFishbowlsPage.loadingMsg")}
          </Typography>
          <CircularColor></CircularColor>
        </Stack>
      )}
    </Stack>
  );
}
