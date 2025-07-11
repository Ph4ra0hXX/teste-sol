const express = require("express");
const growatt = require("growatt");
const cors = require("cors");

const app = express();
app.use(cors());

const port = 3000;

app.use(
  cors({
    origin: "*",
  })
);

const user = "Weine Mendes";
const password = "fazenda16";

app.get("/", async (req, res) => {
  const api = new growatt({});

  try {
    await api.login(user, password);
    const result = await api.getAllPlantData({});
    await api.logout();

    const formattedData = Object.values(result).map((plant) => {
      const deviceKey = Object.keys(plant.devices)[0];
      const device = plant.devices[deviceKey];

      return {
        id: plant.id,
        pac: parseFloat(device.historyLast.pac),
        accountName: plant.plantData.accountName,
        status: device.deviceData.status,
        lastUpdateTime: device.deviceData.lastUpdateTime,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Erro ao acessar Growatt API:", error);
    res.status(500).json({ error: "Erro ao acessar dados do inversor" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
