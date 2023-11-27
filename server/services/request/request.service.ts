import axios from "axios";
import { useLog } from "../../lib/log";
import { RequestRepository } from "../../model/request/request.model";
import https from "https";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
type ExecutionType = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: any;
  subdomain: string;
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async execute({ method, url, headers, body, subdomain }: ExecutionType) {
    console.log("execute", {
      method,
      url,
      headers,
      body,
      subdomain,
    });
    await axios
      .request({
        method,
        url: `https://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
        headers,
        data: "",
        httpsAgent: agent,
      })
      .catch((e) => {
        log.error({ e });
      });
    return;
  }

  async getByTestExecutionId(testExecutionId: string) {
    return this.requestRepository.repository.findOne({
      where: {
        testExecutionId,
      },
      relations: ["response"],
    });
  }
}