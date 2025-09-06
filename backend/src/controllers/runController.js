const Configuration= require("../models/configuration");
const SimulationRun=require("../models/simulation_run");
const SimulationResult = require("../models/simulation_result");
const SimulationTimeseries= require("../models/simulation_timeseries");

// Lancer une simulation (mock)
const RunSimulation=async(req,res)=>{
    try {
        const {id}=req.params;

        // vérifier que la config existe
        const config=await Configuration.findByPk(id);
        
        if(!config){
            return res.status(404).json({error:"Configuration introuvable"});
        }

        // créer un nouveau run
        const run= await SimulationRun.create({
            configuration_id:id,
            status:"running",
            engine_version:"v1.0",
            started_at:new Date(),
        });

        // ---MOCK DES RESULTATS ---
        // valeurs fictives pour tester la structure

        const kwh_year=Math.floor(Math.random() * (20000 - 10000) + 10000);
         const pr_ratio = (Math.random() * 0.2 + 0.75).toFixed(2); // entre 0.75 et 0.95
        console.log(" ID RUN EN COURS: ",run.id)
         const result = await SimulationResult.create({
           simulation_run_id: run.id,
            kwh_year,
            pr_ratio,
            dc_ac_ratio_real: 1.2,
            losses_breakdown: {
                soiling: 2.0,
                thermal: 4.5,
                wiring: 1.0
            },
             monthly_kwh: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2000 + 800)),
      economics: { capex: 10000, opex: 500, lcoe: 0.08 },
      p50_kwh: kwh_year,
      p90_kwh: kwh_year * 0.9
         });

        //  mettre à jour le run comme terminé
        run.status="succeeded"
        run.finished_at=new Date();
        run.duration_ms=run.finished_at-run.started_at
        await run.save();

        return res.status(201).json({run,result})
    } catch (error) {
        console.error("Erreur  lors du mock:",error);
            return res.status(500).json({ error: "Erreur interne lors du run mock" });
    }
}

// Historique des runs d'une configuration
const RunHistoryByConfig=async(req,res)=>{
    try {
        const {id}=req.params;

        const runs= await SimulationRun.findAll({
            where: {configuration_id:id},
            order:[["created_at","DESC"]],
            include:[{model:SimulationResult}]
    });

        return res.status(200).json({runs})
    } catch (error) {
            console.error("Erreur lors de la récupération des runs:", error);
    return res.status(500).json({ error: "Erreur interne lors de la récupération des runs" });
    }
}

// récupérer les résultats  détaillées d'un run
const RunDetails = async(req,res)=>{
    try {
        const {runId}=req.params;
        
        const result = await SimulationResult.findOne({
            where: {simulation_run_id:runId}
        })

        if(!result){
            return res.status(400).json({error:"Résultats introuvables pour ce run"})
        }

        return res.status(200).json(result);

    } catch (error) {
    console.error("Erreur lors de la récupération des résultats:", err);
    return res.status(500).json({ error: "Erreur interne lors de la récupération des résultats" });

    }
}

module.exports={
    RunSimulation,
    RunHistoryByConfig,
    RunDetails,
}